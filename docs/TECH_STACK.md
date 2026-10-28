# Skillora — Technology Stack

## 1. Overview

Skillora is a full-stack student learning journal built using the MERN stack.

The frontend and backend use JavaScript. The project prioritizes maintainable architecture, secure authentication, reliable API communication, responsive design, and automated testing.

This document describes the technologies currently identified in the project. Specific library versions and optional dependencies should be verified against `client/package.json` and `server/package.json`.

## 2. Frontend

| Technology | Purpose |
|---|---|
| React | Build reusable UI components and pages |
| JavaScript (ES6+) | Application logic |
| Vite | Frontend development server and build tooling |
| React Router | Client-side navigation and route management |
| CSS | Responsive styling and application design system |
| Poppins | Application typography |
| Axios | Communicate with backend APIs |
| React Hook Form | Form state management, where used |
| Zod | Data validation, where used |
| React Hot Toast | User notifications, where used |

### Frontend Principles

- Use reusable, maintainable components.
- Separate pages, components, API services, hooks, and utilities.
- Keep API communication organized in service modules.
- Handle loading, empty, success, and error states consistently.
- Validate user input and display understandable feedback.
- Maintain consistent typography, spacing, and component styling.
- Verify responsive layouts on mobile, tablet, and desktop screens.
- Keep API base URLs configurable for local development and production.

The dependencies listed as conditional should be confirmed against the actual client implementation before being treated as installed or actively used.

## 3. Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API and routing |
| MongoDB | Persistent application data storage |
| Mongoose | Database schemas, models, and queries |
| JSON Web Tokens (JWT) | Token-based authentication |
| bcrypt | Password hashing, where used |
| Zod | Request validation |
| Resend | Transactional email delivery through an HTTP API |
| ImageKit | Image upload and management integration, subject to configuration |

### Backend Principles

- Organize routes, controllers, services, models, and middleware into maintainable modules.
- Keep business logic separate from HTTP request handling.
- Validate incoming request data before processing it.
- Centralize error handling and follow consistent API response conventions.
- Enforce authentication and per-user data ownership.
- Keep secrets and external-service credentials in environment variables.
- Handle database and third-party service failures appropriately.
- Avoid exposing internal error details or credentials in API responses.

## 4. Authentication and Security

The authentication system uses JWT-based authentication and supports account registration, login, logout, email verification, password recovery, and profile-related account operations.

Security requirements include:

- Hash passwords before storing them.
- Verify credentials before issuing authenticated access.
- Protect private endpoints with authentication middleware.
- Validate verification and password-reset tokens.
- Prevent users from accessing another user's private learning entries.
- Validate request bodies and query parameters.
- Keep secrets out of source control.
- Configure CORS and other HTTP security controls appropriately.
- Apply suitable rate limits to sensitive endpoints where configured.

The precise token-storage mechanism, cookie settings, token expiry, and invalidation behavior must match the implementation in the authentication middleware, controllers, and configuration.

## 5. Email Delivery

Skillora uses **Resend** to send transactional emails through its API.

Email-related functionality includes:

- Registration verification emails
- Password-recovery emails, where implemented

### Configuration

The backend uses the following environment variables for Resend integration:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Authenticate requests to Resend |
| `EMAIL_FROM` | Configure the sender identity |

The application may use a development sender such as `Skillora <onboarding@resend.dev>` when configured.

For production, configure an appropriate sender identity and complete any domain verification required by the email provider.

Direct SMTP configuration is not the current email-delivery approach. Legacy `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` settings should not be documented as required Resend configuration.

## 6. File Uploads

Skillora has an ImageKit integration for image-related operations.

Profile-photo functionality should be documented as fully operational only after the relevant frontend flow, backend endpoint, provider configuration, and upload behavior have been verified.

### Configuration and Safety

- Keep ImageKit credentials outside source control.
- Validate uploaded file types and sizes.
- Handle upload and deletion failures.
- Return appropriate errors when the image service is unavailable.
- Avoid exposing private credentials to the frontend.

Refer to the implementation and environment configuration to confirm the exact ImageKit variable names and supported operations.

## 7. API Validation and Error Handling

The backend uses Zod for request validation.

Validation should ensure that incoming request data conforms to the expected schema before business logic executes.

The API follows the `/api/v1` version prefix.

API errors should use suitable HTTP status codes and consistent response formats. Invalid input, authentication failures, authorization failures, missing resources, and unexpected server errors should be handled distinctly where appropriate.

Refer to `API_SPECIFICATION.md` for the documented API contract.

## 8. Development and Testing Tools

| Tool | Purpose |
|---|---|
| Git | Version control |
| GitHub | Source-code hosting and collaboration |
| Postman | Manual API testing |
| Jest | Automated JavaScript testing |
| Supertest | HTTP-level Express API testing, where used |
| npm | Package management and script execution |

The backend test setup uses Jest. The project also uses Jest setup configuration to mock external ImageKit operations during tests.

### Testing Commands

Run backend tests from the `server` directory:

```bash
npm test
```

The test suite has previously reported **83 passing tests across 7 test suites**. Re-run the tests after significant code changes to verify the current result.

Vitest should not be listed as the active test runner unless the project introduces and configures it separately.

## 9. Environment Configuration

Keep environment variables separate from application source code. Configure the variables required by the actual implementation in local development and the production hosting environment.

### Backend Variables

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port, if configurable |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used by the relevant JWT implementation |
| `RESEND_API_KEY` | Resend API authentication |
| `EMAIL_FROM` | Transactional email sender identity |
| ImageKit variables | Credentials and configuration required by the image integration |

Other variables may be required by the authentication, CORS, cookie, or deployment configuration. Verify their exact names in the source code.

### Frontend Variables

The frontend may require a Vite environment variable for the backend API base URL. Confirm the exact variable name in the client source code.

### Environment Safety

- Do not commit `.env` files or production credentials.
- Keep placeholder values in example environment files.
- Never expose server secrets through frontend environment variables.
- Configure production values in the hosting provider's environment settings.
- Keep local, test, and production configurations appropriately separated.

## 10. Deployment

The current deployment setup is:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB |
| Transactional email | Resend |
| Image integration | ImageKit |

Deployment configuration must provide the correct database connection, API base URL, authentication settings, and external-service credentials.

After deployment, verify registration, email verification, login, protected API access, learning-entry operations, profile operations, and other supported workflows in the production environment.

## 11. Technology Selection and Maintenance

The project has progressed beyond the initial technology-planning phase. The backend, email integration, automated tests, and deployment setup have been implemented to varying degrees.

When changing a dependency or external service:

1. Confirm the technical reason for the change.
2. Update the package manifest and lockfile where appropriate.
3. Update environment configuration and deployment settings.
4. Run relevant automated tests.
5. Update this document and any affected architecture, security, or testing documentation.

The package manifests and actual source code remain the source of truth for installed dependencies and implemented behavior.
