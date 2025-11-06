
# ✉️ Serverless Email API

This is a simple, cost-effective, and highly scalable REST API for sending emails. It is built on the **Serverless Framework**, using **AWS Lambda** for compute and **AWS SES** (Simple Email Service) for email delivery.

This project is configured for easy local development using `serverless-offline`.

-----

## 🚀 Features

  * **REST API Endpoint:** A single `POST /send-email` endpoint.
  * **Dynamic Content:** Accepts a JSON payload with `receiver_email`, `subject`, and `body_text`.
  * **Robust Error Handling:** Returns proper HTTP status codes for missing fields, server errors, or AWS sandbox rejections.
  * **Local Testing:** Fully configured with `serverless-offline` to run and test on your local machine.
  * **Cloud-Ready:** Deploys to AWS with a single command.

-----

## 🛠️ Technology Stack

  * **Serverless Framework** (v3)
  * **Node.js** (v18.x)
  * **AWS Lambda:** Runs the function code.
  * **AWS SES (Simple Email Service):** Handles email delivery.
  * **AWS API Gateway:** Creates the public HTTP endpoint.
  * **AWS IAM:** Manages permissions for the Lambda function.
  * `serverless-offline`: Plugin for local development.

-----

## 📋 Prerequisites

Before you begin, you will need:

1.  An **AWS Account**.
2.  **AWS SES** set up in "sandbox" mode.
3.  Both the **Sender** and **Receiver** email addresses [verified in the AWS SES console](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html) in the `us-east-1` region.
4.  **Node.js** (v18 or later).
5.  **Serverless Framework (v3)** installed globally:
    ```bash
    npm install -g serverless@3
    ```
6.  An **AWS Access Key** for a user with Administrator permissions.

-----

## ⚙️ Setup & Installation

1.  **Clone or download** this project's files.
2.  **Move into the directory:**
    ```bash
    cd email-api
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Configure AWS Credentials:**
    Run this command and paste in the Access Key and Secret Key you got from the IAM console.
    ```bash
    serverless config credentials --provider aws --key YOUR_KEY --secret YOUR_SECRET
    ```
5.  **Update Configuration:**
    Open `serverless.yml` and change the `SENDER_EMAIL` environment variable to your verified sender email address.

-----

## 💻 Local Development & Testing

This project is set up to run locally without deploying anything to AWS.

### 1\. Start the Server

In your terminal, run:

```bash
serverless offline
```

Your server is now running and listening at `http://localhost:3000`. You will see an endpoint listed: `POST | http://localhost:3000/dev/send-email`.

### 2\. Test with PowerShell Terminal

Open a **new** terminal window and use this command. (Remember to use your verified receiver email\!)

```powershell
curl -Uri 'http://localhost:3000/dev/send-email' -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"receiver_email": "srikant19.rj@gmail.com", "subject": "Test from Local Server!", "body_text": "This is working perfectly!"}'
```

### 3\. Test with Postman

You can also use a tool like Postman:

  * **Method:** `POST`
  * **URL:** `http://localhost:3000/dev/send-email`
  * **Body Tab:** Select `raw` and then `JSON`.
  * **Paste this JSON** into the body:
    ```json
    {
        "receiver_email": "srikant19.rj@gmail.com",
        "subject": "Test from Postman!",
        "body_text": "This is working perfectly!"
    }
    ```

### Successful Response

You will receive a `StatusCode: 200` and this response body:

```json
{
    "message": "Email sent successfully!",
    "messageId": "0100019a59f72de2-..."
}
```

-----

## 🚨 API Error Handling

The API will return the following error codes:

| Code | Response Message | Reason |
| :--- | :--- | :--- |
| `200` | `"Email sent successfully!"` | Everything worked. |
| `400` | `"Request body is missing..."` | The `POST` request was sent with an empty body. |
| `400` | `"Missing required fields..."` | The JSON body is missing `receiver_email`, `subject`, or `body_text`. |
| `400` | `"Email rejected. ..."` | You are in the AWS SES sandbox and the `receiver_email` is not verified. |
| `404` | `"Serverless-offline: route not found."` | You used the wrong method (e.g., `GET`) or URL. |
| `500` | `"Failed to send email."` | A general server or AWS error occurred. |

-----

## ☁️ Deployment to AWS

When you are ready to make your API public, you can deploy it to the AWS cloud.

1.  **Stop** the `serverless offline` server (Ctrl+C).
2.  **Deploy:**
    ```bash
    serverless deploy
    ```
