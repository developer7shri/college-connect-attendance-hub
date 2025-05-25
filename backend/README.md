# SCAHTS Backend

This directory contains the backend code for the SCAHTS (Student Course Allocation and Handling Tracking System) application.

## Getting Started

### Prerequisites

*   Node.js (v14 or later recommended)
*   npm (usually comes with Node.js)
*   MongoDB (running instance, either local or cloud-hosted)

### Installation & Setup

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository_url>
    cd <repository_name>/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create Environment File:**
    *   Create a `.env` file in the `backend` directory.
    *   Copy the contents of `.env.example` (if provided) or add the following variables:
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string_here
        JWT_SECRET=your_super_secret_jwt_key_here

        # Email Configuration (for Nodemailer)
        # Used to send emails for account creation, password resets, etc.
        EMAIL_HOST=your_smtp_host                 # e.g., smtp.gmail.com or smtp.sendgrid.net
        EMAIL_PORT=587                            # Common ports: 587 (TLS), 465 (SSL), 25 (unencrypted - not recommended)
        EMAIL_USER=your_smtp_username             # Your email account username for the SMTP server
        EMAIL_PASS=your_smtp_password_or_app_key  # Your email account password or an app-specific password/API key
        EMAIL_FROM="SCAHTS Admin <noreply@scahts.example.com>" # The "From" address that will appear on emails

        # Optional: For testing with Ethereal (https://ethereal.email/)
        # If ETHEREAL_EMAIL_USER and ETHEREAL_EMAIL_PASS are set (and NODE_ENV is not 'production'),
        # Nodemailer will use Ethereal for testing. A preview URL for sent emails will be logged to the console.
        # This is highly recommended for development and testing to avoid sending real emails.
        # ETHEREAL_EMAIL_USER=your_ethereal_user@ethereal.email
        # ETHEREAL_EMAIL_PASS=your_ethereal_password

        # QR Code Attendance Token Expiry
        QR_TOKEN_EXPIRES_IN=5m # e.g., 5m (minutes), 1h (hours) - controls how long a generated QR code is valid for scanning
        ```
    *   **Important:** Replace placeholder values with your actual MongoDB connection string, a strong JWT secret, and your SMTP/Ethereal details.
    *   **For Production:** Use a reliable SMTP provider (e.g., SendGrid, Mailgun, AWS SES, or your organization's email server).
    *   **For Development/Testing:** Ethereal is excellent. Create an account at [https://ethereal.email/](https://ethereal.email/), get your credentials, and add them to your `.env` file. Emails won't be delivered to real inboxes but can be viewed via the Ethereal preview URL.

4.  **Set up the first Admin account:**
    *   See the "Admin Account Setup" section below.

### Running the Application

```bash
npm start
```

This will typically start the server (e.g., on `http://localhost:5000`).

## API Endpoints

*   `/api/auth/register`: (POST) Register a new user.
*   `/api/auth/login`: (POST) Login an existing user.
*   `/api/auth/update-password`: (PUT) Update user password (requires authentication).
*   *(More endpoints will be documented as they are developed)*

## Project Structure

```
backend/
├── config/         # Configuration files (e.g., db.js)
├── controllers/    # Request handlers (logic for routes)
├── middleware/     # Custom middleware (e.g., auth, error handling)
├── models/         # Mongoose models (database schemas)
├── routes/         # Express route definitions
├── utils/          # Utility functions
├── .env            # Environment variables (ignored by Git)
├── .gitignore      # Specifies intentionally untracked files that Git should ignore
├── package.json    # Project metadata and dependencies
├── package-lock.json # Records exact versions of dependencies
├── server.js       # Main application entry point
└── README.md       # This file
```

## Admin Account Setup

The first Administrator account is critical for system setup and is not created via a public API endpoint for security reasons. It must be manually inserted into the MongoDB database.

### Steps for Manual Setup

1.  **Hash the Admin Password:**
    *   You need to generate a bcrypt hash for your chosen admin password.
    *   Create a temporary Node.js script (e.g., `hashAdminPassword.js`) in the `backend` directory or any other location with `bcryptjs` installed (`npm install bcryptjs` if run standalone):

        ```javascript
        // Filename: hashAdminPassword.js
        const bcrypt = require('bcryptjs');
        const password = 'yourChosenStrongAdminPassword123!'; // Replace with a strong, unique password

        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            console.error('Error generating salt:', err);
            return;
          }
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              console.error('Error hashing password:', err);
              return;
            }
            console.log('Hashed Admin Password:', hash);
            // Example output: $2a$10$Y.INTERESTING.STRING.OF.CHARACTERS...
            // Copy this entire hash value (including the $2a$10$ part)
          });
        });
        ```
    *   Run this script from your terminal:
        ```bash
        node hashAdminPassword.js
        ```
    *   Copy the full hashed password string output by the script.

2.  **MongoDB Insertion:**
    *   Connect to your MongoDB instance using `mongosh` or your preferred MongoDB management tool.
    *   Select the database you configured in your `.env` file for `MONGO_URI`.
        ```javascript
        // In mongosh
        use your_scahts_database_name; // Replace with your actual database name
        ```
    *   Insert the Admin user document into the `users` collection:
        ```javascript
        db.users.insertOne({
          email: "admin@scahts.example.com", // Choose your admin email
          password: "PASTE_THE_HASHED_PASSWORD_FROM_SCRIPT_HERE", // Replace with the hash
          role: "Admin",
          firstName: "Admin",
          lastName: "User", // Or "SCAHTS", "System", etc.
          phoneNumber: "0000000000", // Or a valid placeholder
          isPasswordDefault: false, // Set to false as this is a direct setup
          department: null, // Or specific if applicable, though usually not for a general admin
          semester: null,
          usn: null, // Not applicable for Admin
          createdAt: new Date(),
          updatedAt: new Date()
        });
        ```
        *   **Important:** Replace `"PASTE_THE_HASHED_PASSWORD_FROM_SCRIPT_HERE"` with the actual hash you copied.
        *   Ensure the email is unique.

3.  **Verification:**
    *   You can verify the insertion by running a find query in `mongosh`:
        ```javascript
        db.users.findOne({ email: "admin@scahts.example.com" });
        ```
    *   This should return the document you just inserted (password will be the hash, not the plain text).

### Post-Setup

*   Once the admin account is created, you can log in via the `/api/auth/login` endpoint using the email and the plain text password you chose (the one you put into the `hashAdminPassword.js` script).
*   The system will then compare the hash of the provided password with the stored hash.

## Security Notes

*   **Strong Passwords:** Always use strong, unique passwords for administrator accounts.
*   **`.env` File Security:** The `.env` file contains sensitive information like your `MONGO_URI`, `JWT_SECRET`, and email credentials. Ensure this file is:
    *   Never committed to version control (it's included in `.gitignore`).
    *   Properly secured on your deployment server with restricted permissions.
*   **JWT Secret:** Your `JWT_SECRET` should be a long, random, and complex string to ensure the security of your authentication tokens.
*   **Email Credentials:** Protect your `EMAIL_USER` and `EMAIL_PASS` as you would any other sensitive credential. Consider using app-specific passwords if your email provider supports them.

---
*This README will be updated as the project progresses.*
