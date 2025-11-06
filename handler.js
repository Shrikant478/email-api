'use strict';

// Import the AWS SDK (Software Development Kit)
const AWS = require('aws-sdk');
// Create a new SES (Simple Email Service) object
const SES = new AWS.SES({ region: 'us-east-1' });

/**
 * A helper function to build our HTTP response
 */
const createResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // CORS header
    },
  };
};

/**
 * This is our main API function
 */
module.exports.sendEmail = async (event) => {
  // Use a try...catch block for error handling
  try {
    // 1. ERROR HANDLING (NEW!): Check if a body was sent at all
    if (!event.body) {
      return createResponse(400, {
        message: 'Request body is missing. Please send a JSON object with receiver_email, subject, and body_text.',
      });
    }

    // 2. Get the data from the API request
    const body = JSON.parse(event.body);

    const { receiver_email, subject, body_text } = body;

    // 3. ERROR HANDLING (HTTP 400): Check if all required fields are present
    if (!receiver_email || !subject || !body_text) {
      // If not, return a 400 (Bad Request) error
      return createResponse(400, {
        message: 'Missing required fields: receiver_email, subject, or body_text',
      });
    }

    // 4. Get our SENDER_EMAIL from the environment variables
    const sender_email = process.env.SENDER_EMAIL;

    // 5. Build the email parameters for SES
    const params = {
      Source: sender_email, // The "From" address (must be verified)
      Destination: {
        ToAddresses: [receiver_email], // The "To" address
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: body_text,
          },
        },
      },
    };

    // 6. Send the email!
    const result = await SES.sendEmail(params).promise();

    // 7. Send a 200 (OK) success response!
    return createResponse(200, {
      message: 'Email sent successfully!',
      messageId: result.MessageId,
    });

  } catch (error) {
    // 8. ERROR HANDLING: If anything else fails
    console.error('Error sending email:', error);
    
    // Handle the "MessageRejected" error from the SES sandbox
    if (error.code === 'MessageRejected') {
      return createResponse(400, {
         message: 'Email rejected. In sandbox mode, the receiver_email must also be verified.',
         error: error.message
      });
    }

    // Return a 500 (Internal Server Error) for all other errors
    return createResponse(500, {
      message: 'Failed to send email.',
      error: error.message,
    });
  }
};