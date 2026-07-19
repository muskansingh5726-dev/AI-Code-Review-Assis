# AI Code Review Assistant

## About the Project

This project was developed as part of my web development internship. The main idea behind this project is to help programmers review their code with the help of AI.

Users can write code in the editor or upload a source file. The code is compiled and executed using Judge0, and an AI model analyzes it to provide suggestions for improving code quality, readability, and best practices. Every review is saved so users can access it later.

---

## Features

- User Registration & Login
- JWT Authentication
- Code Editor (Monaco Editor)
- Supports Java, Python, C, C++ and JavaScript
- Upload source code files
- Compile and Execute Code using Judge0
- AI Code Review using Groq
- AI Review Score
- Suggestions for improving code
- Review History
- Download Review Report as PDF
- Dashboard with review statistics

---

## Technologies Used

### Frontend
- React.js
- Vite
- React Router
- Axios
- Monaco Editor
- React Toastify

### Backend
- Node.js
- Express.js
- JWT
- Multer

### Database
- PostgreSQL (Neon)

### APIs
- Judge0 API
- Groq API

---

## Folder Structure

```
AI-Code-Review-Assistant
│
├── client
│
├── server
│
└── README.md
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/muskansingh5726-dev/AI-Code-Review-Assistant.git
```

Install dependencies

### Client

```bash
cd client
npm install
```

### Server

```bash
cd server
npm install
```

Create a `.env` file inside the server folder and add the required environment variables.

Start the backend

```bash
cd server
npm run dev
```

Start the frontend

```bash
cd client
npm run dev
```

---

## Screenshots

### Login Page

(Add Screenshot)

### Dashboard

(Add Screenshot)

### Review Page

(Add Screenshot)

### Result Page

(Add Screenshot)

### History

(Add Screenshot)

---

## Challenges Faced

While developing this project, I faced a few challenges such as:

- Integrating Judge0 API for compiling different programming languages.
- Parsing AI responses into a structured format.
- Managing file uploads along with manual code input.
- Storing review history in PostgreSQL.
- Generating downloadable PDF reports.

These challenges helped me understand API integration, backend development, and database management better.

---

## Future Improvements

Some features that can be added in the future are:

- Dark Mode
- More programming language support
- Review analytics
- Better code visualization
- Cloud deployment

---

## Author

**Muskan Singh**

B.Tech Computer Science Engineering

Presidency University

GitHub:
https://github.com/muskansingh5726-dev