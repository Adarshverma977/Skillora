# Skillora — Student Learning Journal

Skillora is a full-stack MERN application designed to help students document their daily learning activities, track study time, analyze learning progress, and build consistent study habits.

The application provides a personal learning journal, dashboard analytics, authentication, and profile management through a responsive interface.

## Live Application

- **Frontend:** https://skillora-learn.vercel.app/
- **Backend:** https://skillora-api-g3xe.onrender.com
- **API Base Path:** `/api/v1`

## Project Overview

Skillora helps students organize what they learn, record study sessions, review their learning history, and monitor their progress over time.

The project follows a modular client-server architecture, with a React frontend and a Node.js/Express backend connected to MongoDB.

## Features

### Authentication and Security

- Student registration and login
- JWT-based authentication
- Email verification
- Logout functionality
- Forgot-password and reset-password workflows
- Protected application routes and API endpoints
- Password-change functionality

### Learning Journal

- Create learning entries
- Record topic names and learning descriptions
- Track study duration
- Record learning difficulty
- View, edit, and delete entries
- View individual entry details

### Dashboard and Analytics

- Total learning entries
- Study-duration statistics
- Learning analytics
- Average session duration
- Unique-topic statistics
- Dashboard summaries based on learning activity

### Search and Filters

- Search learning topics
- Filter entries by date
- Filter entries by difficulty
- Validate query parameters

### Profile Management

- Retrieve profile information
- Update profile details
- Password changes
- Profile-photo integration where supported

### User Experience

- Responsive application layout
- Poppins typography
- Light and dark theme support
- Form validation and useful error messages
- Loading and empty states
- Toast notifications
- Consistent visual styling

*Feature availability may vary while frontend integration and verification are in progress.*

## Technology Stack

### Frontend

- React
- JavaScript
- Vite
- React Router
- CSS
- API service layer

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Password hashing
- Zod request validation
- Resend API for email delivery

### Testing

- Jest
- Supertest where configured
- Postman
- Mocked external dependencies for automated tests

### Development and Deployment

- Git and GitHub
- Visual Studio Code
- Vercel for frontend deployment
- Render for backend deployment
- MongoDB for data storage
- Resend for email delivery

## Project Structure

```text
Skillora/
├── client/                 # React frontend
├── server/                 # Node.js and Express backend
├── docs/                   # Project documentation
├── .gitignore
└── README.md
```

The client and server maintain separate dependencies and configuration. Refer to their respective directories for installation and execution commands.

## Getting Started

### Prerequisites

Install the following before running the project locally:

- Node.js and npm
- MongoDB local instance or an accessible MongoDB deployment
- Git

A Resend API key is required for the configured email-delivery functionality.

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Skillora
```

Replace `<YOUR_REPOSITORY_URL>` with the actual Git repository URL.

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory and configure the environment variables required by the backend.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Skillora <onboarding@resend.dev>
```

Use the exact variable names expected by the current server configuration. Never commit real credentials to Git.

Start the backend using the script defined in `server/package.json`. For example, if the project defines a `dev` script:

```bash
npm run dev
```

### 3. Configure the Frontend

Open a separate terminal:

```bash
cd client
npm install
```

Configure the frontend environment variable for the backend API URL according to the API client implementation.

For a typical Vite configuration, this may be:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Use the exact variable name expected by the current frontend code.

Start the frontend using the script defined in `client/package.json`. For a standard Vite setup:

```bash
npm run dev
```

### 4. Verify the Application

- Confirm that the backend starts and connects to MongoDB.
- Confirm that the frontend starts successfully.
- Verify registration, email verification, and login.
- Test learning-entry operations and dashboard data.
- Verify profile functionality and protected routes.
- Check browser and server logs for errors.

For the complete setup, environment configuration, API details, and testing instructions, consult the documentation in `docs/`.

## Automated Testing

The backend uses Jest for automated testing, with Supertest where configured.

Run the backend tests from the `server/` directory:

```bash
npm test
```

The latest recorded test run passed **83 tests across 7 test suites**. Test results can change as the code evolves, so run the suite again after making changes.

Postman is used for manual API verification.

## Security Practices

- Protect private routes and API endpoints.
- Enforce authenticated ownership of learning entries.
- Hash passwords using an appropriate password-hashing algorithm.
- Validate incoming requests.
- Keep secrets and environment variables out of version control.
- Avoid exposing sensitive authentication information in API responses.
- Configure CORS and other production security settings appropriately.
- Verify authentication, authorization, and password-recovery workflows before release.

## Documentation

Project documentation is maintained in the `docs/` directory.

| Document | Purpose |
|---|---|
| `PROJECT_REQUIREMENTS.md` | Functional and non-functional requirements |
| `TECH_STACK.md` | Technologies and dependencies |
| `PROJECT_ARCHITECTURE.md` | Application architecture and data flow |
| `DATABASE_SCHEMA.md` | Database models and relationships |
| `API_SPECIFICATION.md` | API operations and conventions |
| `AUTHENTICATION_SECURITY.md` | Authentication and security design |
| `TESTING_STRATEGY.md` | Automated and manual testing |
| `UI_UX_GUIDELINES.md` | Interface and responsive design guidelines |
| `IMPLEMENTATION_ROADMAP.md` | Development phases and verification criteria |

## Development Status

**Current focus:** Frontend development, integration, and feature verification.

The backend foundation, core authentication flows, learning-entry functionality, analytics foundations, profile APIs, automated tests, and initial deployment have been established.

The frontend and backend are deployed, and registration, email verification, and login have been verified. Remaining features and complete end-to-end workflows should be considered complete only after their acceptance criteria have been tested.

## Git Workflow

Use focused commits for changes to different parts of the project.

Examples:

```bash
git add docs/
git commit -m "docs: update project documentation"
```

```bash
git add server/
git commit -m "server: update backend functionality"
```

```bash
git add client/
git commit -m "client: improve frontend experience"
```

Review `git status` before staging files, and avoid including unrelated or unfinished changes in a commit.

## License

The project license will be decided before public release.
