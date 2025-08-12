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

**Deploy Link:** [https://secrets-web-project-kfax.onrender.com]

