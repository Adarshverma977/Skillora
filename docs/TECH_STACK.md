# Skillora — Technology Stack

## 1. Overview

Skillora is a full-stack student learning journal built using the MERN stack. The application will use JavaScript across the frontend and backend wherever practical.

Technology choices will prioritize maintainability, security, responsive user experience, and production readiness.

## 2. Frontend

| Technology | Purpose |
|---|---|
| React | Build reusable UI components and pages |
| JavaScript (ES6+) | Application logic |
| Vite | Frontend development server and build tooling |
| React Router | Client-side navigation and protected pages |
| CSS | Responsive styling and design system |
| Poppins | Consistent application typography |
| Axios | Communicate with backend APIs |
| React Hook Form | Manage forms efficiently |
| Zod | Validate form data |
| React Hot Toast | Display user notifications |

**Frontend principles**
- Use reusable, maintainable components.
- Separate pages, components, API services, hooks, and utilities.
- Keep loading, empty, success, and error states consistent.
- Build and verify mobile layouts alongside desktop layouts.

## 3. Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API and routing |
| MongoDB | Store users and learning entries |
| Mongoose | Define schemas and interact with MongoDB |
| JSON Web Tokens (JWT) | Authenticate API requests |
| bcrypt | Hash passwords securely |
| Zod | Validate incoming request data |
| Nodemailer | Send email verification and password-reset emails |

**Backend principles**
- Use modular routes, controllers, services, and middleware.
- Keep business logic separate from HTTP request handling.
- Validate incoming data before processing it.
- Centralize error handling and API response conventions.
- Enforce authentication and per-user data ownership.

## 4. Authentication and Security

- Hash passwords with bcrypt before storing them.
- Use short-lived access tokens and an appropriately designed session strategy.
- Protect private API endpoints with authentication middleware.
- Use secure token handling appropriate to the deployment environment.
- Verify email ownership during registration.
- Use expiring, single-use tokens for password recovery.
- Never commit secrets, credentials, or environment files.
- Configure CORS, request limits, and security headers appropriately.

The final authentication design will be documented before implementation.

## 5. File Uploads

Profile photos will be validated by file type and size.

The production storage provider will be selected before profile-photo upload is implemented. Application configuration and credentials must remain outside source control.

## 6. Development and Testing Tools

| Tool | Purpose |
|---|---|
| Git | Version control |
| GitHub | Source-code hosting |
| Postman | API testing |
| ESLint | Identify JavaScript code issues |
| Vitest | Frontend and JavaScript unit testing |
| Supertest | Test Express API endpoints |

Additional testing tools may be introduced when integration and end-to-end testing are planned.

## 7. Environment Configuration

Separate environment configuration will be maintained for the client and server when required.

Examples of server environment variables:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

The actual `.env` files must not be committed to Git. Example configuration files may contain placeholder values only.

## 8. Deployment

The hosting providers for the frontend, backend, database, email delivery, and profile-photo storage will be selected after implementation requirements and pricing are evaluated.

Deployment instructions will be documented separately.

## 9. Technology Selection Status

**Status:** Initial technology plan documented.

The selected technologies will be installed and verified during setup. Any later change must have a clear technical reason and be reflected in this document.