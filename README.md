# Banking Application

This is a banking application built using Nest.js, React.js, MongoDB, Swagger, and Nodemailer. It allows users to transfer money using mobile numbers and account numbers, view mini statements, and download weekly or monthly transaction summaries in PDF format.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Email Configuration](#email-configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

1. Money Transfer:

   - Users can transfer money to others using mobile numbers and account numbers.
   - Validate and authenticate users for secure transactions.

2. Mini Statements:

   - Users can view their last 5 transactions.

3. Transaction Downloads:

   - Users can download weekly or monthly transaction summaries in PDF format.

4. User Authentication:

   - Ensure secure access to user accounts with authentication.

5. API Documentation:
   - API documentation using Swagger for easy reference.

## Technologies Used

- Nest.js: A backend framework for building scalable and maintainable server-side applications.
- React.js: A front-end library for building user interfaces.
- MongoDB: A NoSQL database for storing user and transaction data.
- Swagger: For documenting the API endpoints.
- Nodemailer: For sending OTP over email.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MrNagarOO7/banking_application
   ```

2. Install the dependencies for the backend and frontend:

   ```bash
   cd banking-application/backend
   npm install

   cd ../frontend
   npm install
   ```

## Configuration

1. Configure backend/frontend using .env file.

## Running the Application

1. Start the backend server:

   ```bash
   cd banking-application/backend
   npm start
   ```

2. Start the frontend development server:

   ```bash
   cd banking-application/frontend
   npm start
   ```

3. Access the application in your browser at http://localhost:3000.

## API Documentation

API endpoints are documented using Swagger. Access the API documentation at http://localhost:3001/swagger-api/ after starting the backend server.

## Email Configuration

Configure Nodemailer with your SMTP server settings in `backend/.env` to OTP.

## Usage

1. Register and authenticate users.
2. Use the web interface to transfer money to others.
3. View mini statements to check recent transactions.
4. Download weekly or monthly transaction summaries in PDF format.
5. Explore the API documentation for additional features.

## Contributing

Contributions are welcome. Please follow the [contribution guidelines](CONTRIBUTING.md) when making changes to the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to customize and expand upon this README as needed for your specific project. Ensure that you have proper error handling, security measures, and testing in place for a production-ready application.
