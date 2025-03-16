# JobReady

## Overview

JobReady is a web application designed to assist users in preparing for job interviews. It offers functionalities such as managing user profiles and tracking interview preparation progress.

## Features

- **User Profiles**: Users can create and manage their profiles, including personal information and career objectives.
- **Interview Preparation Tracking**: Monitor and update the status of interview preparations, including scheduling and feedback.

## Technologies Used

- **Frontend**: Handlebars.js (templating engine), CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Version Control**: Git & GitHub

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Ensure you have a running instance)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/sjalaleddine2/JobReady.git
   cd JobReady
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the project root and add the following:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/jobready
   SESSION_SECRET=your_secret_key
   ```

4. **Start the Application**

   ```bash
   npm start
   ```

   The application will be accessible at `http://localhost:3000`.

## Usage

- **Create and Manage Profile**: Users can input and update their personal information and career objectives.
- **Track Interview Preparation**: Users can monitor their interview schedules and feedback to improve their preparation.

## License

This project is licensed under the MIT License.


