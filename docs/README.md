# Skillora — Student Learning Journal

Skillora is a full-stack MERN application that helps students document their daily learning activities, track study time, analyze learning progress, and build consistent study habits.

## Project Overview

Skillora provides a personal learning journal where students can organize learning topics, record study sessions, monitor productivity, and manage their profiles through a responsive interface.

The application includes authentication, learning-entry management, dashboard analytics, search and filtering, and profile management.

## Features

### Authentication and Account Security

- Student registration and login
- Logout functionality
- Email verification
- Forgot-password and password-reset functionality
- JWT-based authentication
- Protected routes and API endpoints
- Password hashing
- Secure authentication and error handling

### Learning Journal

- Create learning entries
- Record topic names and descriptions
- Track study duration
- Set difficulty levels
- View, update, and delete learning entries
- View individual entry details
- Associate learning entries with authenticated users

### Dashboard and Analytics

- Total learning entries
- Aggregate study duration
- Weekly learning summaries
- Recently added learning topics
- Productivity overview
- Learning-entry analytics

### Search and Filtering

- Search learning entries by topic
- Filter entries by date
- Filter entries by difficulty level

### Profile Management

- View personal profile information
- Update profile details
- Upload a profile photo
- Change password

### User Experience

- Responsive interface for desktop and mobile devices
- Consistent typography using the Poppins font
- Light and dark mode
- Loading indicators and skeleton screens
- Toast notifications
- Form validation
- Consistent API error handling

> Feature availability may vary by implementation. Refer to the relevant API, architecture, and testing documentation for verified details.

## Technology Stack

### Frontend

- React
- JavaScript
- CSS
- Vite
- React Router
- Additional libraries used by the client application

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Zod for request validation
- Resend for transactional email delivery

### Testing and Development Tools

- Jest
- Supertest
- Postman
- Git and GitHub
- Visual Studio Code

### Deployment

- Vercel for the frontend
- Render for the backend
- MongoDB for persistent data storage

## Project Structure

```text
Skillora/
├── client/       # React frontend application
├── server/       # Node.js and Express backend
├── docs/         # Project documentation
├── .gitignore
└── README.md     # Root project documentation
```

The `client` and `server` directories contain the frontend and backend implementations, respectively. The `docs` directory contains the project's technical and implementation documentation.

## Getting Started

### Prerequisites

Install the following tools before setting up the project locally:

- Node.js and npm
- MongoDB or an accessible MongoDB database
- Git
- Postman (recommended for API testing)

### Installation

Clone the repository and open the project directory:

```bash
git clone <YOUR_REPOSITORY_URL>
cd Skillora
```

Install the backend dependencies:

```bash
cd server
npm install
```

Install the frontend dependencies:

```bash
cd ../client
npm install
```

### Environment Configuration

Configure the required environment variables separately for the backend and frontend.

The backend configuration may include:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- Other secrets required by the implemented features

The frontend may require a Vite environment variable for the backend API base URL.

Use the actual variable names referenced in the source code and deployment configuration. Do not commit `.env` files, API keys, JWT secrets, or other sensitive credentials.

Refer to the authentication, architecture, and deployment-related documentation for the complete configuration details.

### Running the Application

Start the backend using the script defined in `server/package.json`. For example, if the project defines a `dev` script:

```bash
cd server
npm run dev
```

Start the frontend in a separate terminal using the script defined in `client/package.json`:

```bash
cd client
npm run dev
```

Use the local URLs printed by the development servers to access the application and API.

## API Overview

The backend API uses the `/api/v1` prefix.

Authentication endpoints are grouped under the authentication routes, while learning-entry, analytics, and profile operations are handled by their respective route modules.

For complete endpoint paths, request payloads, validation rules, and response formats, refer to [`API_SPECIFICATION.md`](./API_SPECIFICATION.md).

## Testing

The backend uses Jest for automated tests, with Supertest for HTTP-level testing where configured. Postman can be used for manual API verification.

Run the automated backend tests from the `server` directory:

```bash
npm test
```

Consult [`TESTING_STRATEGY.md`](./TESTING_STRATEGY.md) for test organization, execution instructions, and coverage details.

## Security

Skillora follows these security principles:

- Protect private routes and API endpoints.
- Restrict access to learning entries to their authenticated owners.
- Hash passwords before storing them.
- Validate incoming requests.
- Keep secrets and environment variables out of version control.
- Handle authentication failures and application errors consistently.
- Use email verification and password-reset workflows where implemented.
- Configure authentication cookies and other security controls according to the actual server implementation.

Email delivery uses the Resend API rather than a direct SMTP connection.

## Documentation

The `docs` directory contains the following project documentation:

| Document | Purpose |
|---|---|
| `README.md` | Project overview and setup guide |
| `PROJECT_REQUIREMENTS.md` | Functional and non-functional requirements |
| `TECH_STACK.md` | Technology choices and dependencies |
| `PROJECT_ARCHITECTURE.md` | Application architecture and request flow |
| `DATABASE_SCHEMA.md` | Database models and relationships |
| `API_SPECIFICATION.md` | API endpoints and request/response details |
| `AUTHENTICATION_SECURITY.md` | Authentication and security design |
| `UI_UX_GUIDELINES.md` | Interface and user-experience guidelines |
| `TESTING_STRATEGY.md` | Automated and manual testing |
| `IMPLEMENTATION_ROADMAP.md` | Development phases and milestones |

## Deployment

The frontend is deployed on Vercel, and the backend is deployed on Render.

Production deployment requires the correct environment variables, database connectivity, frontend API configuration, and email-provider configuration.

Verify the production environment after changes to authentication, email delivery, API routes, or deployment settings.

## Development Status

Skillora has progressed beyond the initial documentation phase. Backend authentication, email verification, learning-entry functionality, analytics, profile APIs, and automated tests have been developed and tested to varying degrees.

The frontend and backend should be assessed independently when recording completion status. A feature should be marked complete only when its implementation and relevant verification have been confirmed.

## License

The project license has not yet been specified. Add an appropriate license before distributing the project publicly.
