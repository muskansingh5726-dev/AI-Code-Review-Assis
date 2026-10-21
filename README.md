# AI Code Review Assistant

An AI-powered code review platform that helps developers understand their code, identify potential bugs, improve readability, and explore better coding practices.

**Live Application:** https://ai-code-review-assis.vercel.app/  
**GitHub Repository:** https://github.com/muskansingh5726-dev/AI-Code-Review-Assis

## Overview

AI Code Review Assistant is a full-stack web application built with React, Node.js, Express, PostgreSQL, and Groq-powered AI.

Users can submit code for AI-assisted feedback, interact with an AI coding assistant, and access saved reviews through an authenticated dashboard.

The application also includes a code execution feature for supported languages. The public execution endpoint may be temporarily disabled while execution security is improved.

## Features

- User registration and login
- JWT-based authentication
- Protected application routes
- AI-powered code reviews using Groq
- Code editor and source-code upload
- Java, Python, and JavaScript execution support in the current local runner
- AI coding chat with concise responses
- Dashboard and review history
- Review findings and improvement suggestions
- Interactive demo page using clearly labelled sample results

## Technology Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Monaco Editor
- Tailwind CSS and other UI styling

### Backend
- Node.js
- Express.js
- JWT authentication
- Multer for file uploads
- Language-specific code analyzers

### Database and AI
- PostgreSQL
- Neon
- Groq API

### Deployment
- Vercel — frontend
- Render — backend

## Architecture

```text
Developer / Browser
        |
        v
 React + Vite Frontend
        |
        | HTTP requests
        v
 Express.js REST API
        |
        +------ Authentication
        |
        +------ AI Review and Chat
        |             |
        |             v
        |          Groq API
        |
        +------ Code Runner
        |       Java / Python / JavaScript
        |
        v
 PostgreSQL Database
        |
        v
 Review History and Dashboard Data
```

**Security note:** Execution timeouts and input validation alone are not sufficient to securely isolate arbitrary code. Public code execution should remain disabled until proper operating-system or container isolation, resource limits, and access restrictions are implemented and verified.

## Project Structure

```text
AI-Code-Review-Assis/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── styles/
│   └── package.json
├── server/
│   ├── analyzers/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
└── README.md
```

## Run Locally

### Prerequisites

- Node.js and npm
- PostgreSQL database
- Groq API key
- Java JDK and Python installed if you want to test those local execution analyzers

### 1. Clone the repository

```bash
git clone https://github.com/muskansingh5726-dev/AI-Code-Review-Assis.git
cd AI-Code-Review-Assis
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

Start the frontend using the development script defined in `client/package.json`.

### 3. Install backend dependencies

Open a second terminal from the project root:

```bash
cd server
npm install
```

Create a `server/.env` file and configure the environment variables required by the backend.

Example variable names may include:

```env
DATABASE_URL=
JWT_SECRET=
GROQ_API_KEY=
PORT=5000
```

Use the exact names expected by the current backend source code. Do not commit real credentials or API keys.

For local testing only, code execution can be enabled using the route's configured environment flag, if that flag is present in your local code.

### 4. Start the backend

```bash
npm run dev
```

### 5. Start the frontend

In the frontend terminal:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Screenshots

Add screenshots captured from the actual running application to a `docs/screenshots/` directory, then link them here.

Suggested screenshots:

- Landing page
- Login page
- Code review editor
- AI review results
- Dashboard and review history
- AI chat
- Interactive demo

Example Markdown for a screenshot:

```markdown
![AI Code Review Assistant landing page](docs/screenshots/landing.png)
```

Only add image links after the corresponding screenshot files exist in the repository.

## Challenges and Learning

This project provided practical experience with:

- Integrating an LLM into a full-stack application
- Designing REST API endpoints
- Implementing authentication and protected routes
- Connecting a PostgreSQL database
- Handling source-code input and execution errors
- Managing asynchronous API requests and UI states
- Deploying a React frontend and Node.js backend

## Future Improvements

- Secure, isolated code execution
- More programming languages
- Automated testing and security checks
- Improved review analytics
- Enhanced mobile experience
- Additional code-quality metrics

## Screenshots

### Landing Page
![Landing Page](./Screenshot%202026-10-21%20170628.png)

### Dashboard
![Dashboard](./Screenshot%202026-10-21%20170713.png)

### Code Review Workspace
![Code Review Workspace](./Screenshot%202026-10-21%20170808.png)

### AI Review Results
![AI Review Results](./Screenshot%202026-10-21%20170838.png)
## Author

**Muskan Singh**  
B.Tech — Computer Science and Engineering

GitHub: https://github.com/muskansingh5726-dev
