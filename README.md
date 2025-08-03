# Secrets App

## Overview

The "Secrets" web application is a full-stack project designed to illustrate robust authentication and security measures. It provides a secure environment for users to share and manage secrets confidently, implementing best practices in web security and ensuring data integrity.

## Features

-   **User Registration:** A secure sign-up process with email and password format verification. Passwords are securely hashed using `bcrypt`.
-   **Secure Login:** Users can log in with their email and password, which are validated against securely stored credentials.
-   **Session Management:**
    -   Utilizes **secure, HttpOnly cookies** to manage user sessions.
    -   Implements **JSON Web Tokens (JWT)** for stateless authentication.
-   **Logout:** A simple mechanism to log users out and clear their session.
-   **Attractive UI:** The user interface is designed to be clean, intuitive, and modern.

## Technologies Used

-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB
-   **Templating Engine:** EJS
-   **Authentication:** `bcrypt` for password hashing, `jsonwebtoken` for JWT
-   **Deployment:** Render

## Deployment

The application is deployed on Render. You can access the live version here:

**Deploy Link:** [Insert your Render Deploy Link here]

### How to Deploy

To deploy this project on Render, follow these steps:

1.  **Create a GitHub Repository:** Push your code to a new GitHub repository.
2.  **Connect to Render:** Log in to your Render account, navigate to the Dashboard, and click "New" > "Web Service."
3.  **Select Repository:** Connect your GitHub account and select the repository for this project.
4.  **Configure Web Service:**
    -   **Name:** `secrets-app` (or any unique name)
    -   **Root Directory:** Leave blank.
    -   **Build Command:** `npm install`
    -   **Start Command:** `node index.js`
    -   **Instance Type:** Free
5.  Click "Create Web Service" to start the deployment.

For a more detailed walkthrough, please refer to the deployment video: [https://youtu.be/tNpoc86cHrQ?si=EeMCQBl7YO2bWrdE](https://youtu.be/tNpoc86cHrQ?si=EeMCQBl7YO2bWrdE)

## Getting Started Locally

1.  Clone the repository: `git clone <your-repo-link>`
2.  Install dependencies: `npm install`
3.  Start the server: `node index.js`
4.  The app will be running on `http://localhost:3000`.

## Author

[Parekh Vaibhavi]
