# Skillora — Project Architecture

## 1. Architecture Overview

Skillora follows a modular client-server architecture based on the MERN stack.

The React frontend communicates with the Express REST API over HTTP. The backend validates requests, applies authentication and authorization rules, executes business logic, and interacts with MongoDB through Mongoose.

The application also integrates with external services for transactional email delivery and image-related operations.

The architecture separates presentation, API handling, business logic, data persistence, and external-service integration to improve maintainability and testability.

## 2. High-Level Architecture

```text
┌───────────────────────────────┐
│         Student/User          │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        React Frontend         │
│                               │
│ Pages and Components          │
│ Forms and UI State            │
│ API Service Modules           │
│ Client-side Navigation        │
└───────────────┬───────────────┘
                │ HTTP / JSON
                ▼
┌───────────────────────────────┐
│       Express REST API        │
│                               │
│ Routes and Middleware         │
│ Authentication and Validation│
│ Controllers and Services      │
│ Error Handling                │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Mongoose Layer          │
│                               │
│ Models, Queries, Aggregations │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│           MongoDB             │
│                               │
│ Users and Learning Entries    │
└───────────────────────────────┘

External Integrations:
- Resend: Transactional email delivery
- ImageKit: Image-related operations
```

## 3. Frontend Architecture

The frontend is responsible for rendering the application interface and coordinating user interactions with the backend API.

Its responsibilities include:

- Rendering pages and reusable UI components.
- Managing client-side navigation.
- Collecting user input and displaying validation feedback.
- Calling backend endpoints through API service modules.
- Displaying loading, empty, success, and error states.
- Presenting dashboard statistics and learning-entry analytics.
- Supporting responsive layouts and the application's theme options.
- Providing profile and learning-journal management interfaces.

Client-side route protection improves the user experience but is not a security boundary. The backend must independently authenticate and authorize protected operations.

The frontend API configuration must point to the correct backend in both local development and production.

## 4. Backend Architecture

The backend exposes versioned REST endpoints under the `/api/v1` prefix.

Its responsibilities include:

- Matching requests to API routes.
- Authenticating protected requests.
- Validating request bodies and query parameters.
- Enforcing authorization and data-ownership rules.
- Executing authentication, journal, profile, and analytics operations.
- Reading and writing application data through Mongoose.
- Coordinating transactional email and image-related integrations.
- Returning appropriate HTTP status codes and JSON responses.
- Handling expected and unexpected failures consistently.

The backend uses Zod for request validation and Jest for automated tests.

### Logical Layers

| Layer | Responsibility |
|---|---|
| Routes | Define API endpoints and attach middleware |
| Middleware | Perform authentication, validation, and other request checks |
| Controllers | Handle HTTP request and response coordination |
| Services | Encapsulate business operations and external-service interactions where applicable |
| Models | Define MongoDB document structures and database behavior |
| Error handling | Convert application failures into consistent API responses |

The table describes the logical responsibilities of the architecture. The precise organization of each operation should be verified against the current source files.

## 5. Backend Request Lifecycle

A typical protected API request follows this flow:

1. The frontend sends an HTTP request to the backend.
2. Express receives the request and matches the configured route.
3. Applicable middleware performs authentication and request validation.
4. The controller coordinates the requested operation.
5. Business logic executes in the relevant controller or service layer.
6. Mongoose queries or updates MongoDB when database access is required.
7. The backend returns a JSON response with an appropriate HTTP status.
8. The frontend updates the interface based on the response.

If a request fails, the backend passes the error through its configured error-handling mechanism. The client receives an appropriate error response rather than internal stack traces or sensitive configuration details.

The exact middleware order depends on the route and the operation being performed.

## 6. Authentication Architecture

Skillora supports account registration, email verification, login, logout, password recovery, and authenticated account operations.

### 6.1 Registration and Email Verification

1. The student submits registration details.
2. The backend validates the input.
3. The password is hashed before being stored.
4. The account and verification workflow are processed.
5. The backend uses the email service to send a verification message.
6. The student follows the verification flow.
7. The backend validates the verification token and updates the account's verification state as appropriate.

Transactional email delivery uses the Resend API rather than a direct SMTP connection.

### 6.2 Login

1. The student submits login credentials.
2. The backend validates the request.
3. The submitted credentials are checked against the stored account information.
4. The account-verification policy is applied.
5. On successful authentication, the configured JWT-based authentication mechanism is used.
6. Subsequent protected requests are authenticated according to the implemented token or session strategy.

Token transport, expiration, and storage must match the current authentication implementation.

### 6.3 Protected Requests

1. The frontend sends a request to a protected endpoint.
2. Authentication middleware validates the supplied authentication credentials.
3. The backend identifies the authenticated user.
4. Authorization checks determine whether the user can access the requested resource.
5. The backend performs the operation only if the required checks pass.

For learning-entry operations, resource ownership must be checked independently of whether the requester knows an entry's identifier.

### 6.4 Password Recovery

The password-recovery workflow consists of:

1. Accepting a password-reset request.
2. Initiating the reset process through the configured email service.
3. Validating the reset token when the student submits a new password.
4. Applying password validation rules.
5. Hashing and saving the new password.
6. Enforcing the configured token-expiry and invalidation behavior.

The exact token lifetime, storage method, and invalidation rules are determined by the authentication implementation.

## 7. Database Architecture

MongoDB stores the application's persistent data. Mongoose provides models, schemas, validation, and database access.

### 7.1 User

The User model stores student account information and the fields required for authentication, email verification, profile management, and password recovery.

The precise field names, schema constraints, indexes, and optional fields are documented in `DATABASE_SCHEMA.md`.

### 7.2 Learning Entry

The Learning Entry model stores a student's learning-journal information, including:

- Topic
- Description
- Study duration
- Difficulty
- User association
- Relevant timestamps

The exact field names and schema configuration are defined by the current model.

### 7.3 Data Ownership

Every learning entry must be associated with its owning user.

The backend must scope reads, updates, deletions, and analytics to the authenticated user's identity. An entry identifier alone must not grant permission to access another user's data.

Detailed schemas, indexes, constraints, and relationships are maintained in `DATABASE_SCHEMA.md`.

## 8. Dashboard and Analytics Data Flow

Dashboard and analytics endpoints retrieve or aggregate learning data for the authenticated user.

The application supports analytics related to:

- Total learning entries
- Aggregate study duration
- Weekly learning activity
- Recently added entries or topics
- Productivity information
- Average session duration
- Unique-topic counts

The backend uses MongoDB queries and aggregation operations where appropriate.

Analytics must follow these rules:

- Scope data to the authenticated user.
- Use consistent duration units.
- Define date boundaries clearly.
- Handle empty datasets without producing misleading results.
- Normalize topic names consistently when calculating unique topics where specified.

The exact response fields and calculations should remain consistent with `API_SPECIFICATION.md` and the implemented analytics controllers.

## 9. Search and Filtering Data Flow

The client sends supported search and filter parameters to the relevant API endpoint.

The backend validates the parameters and retrieves only matching entries belonging to the authenticated user.

Supported search and filtering capabilities include:

- Topic-name search
- Date-based filtering
- Difficulty-level filtering

When multiple filters are supplied, the backend should apply them consistently according to the API contract. Invalid parameters should produce appropriate validation errors.

The API specification defines the accepted query parameters and response format.

## 10. Profile and Image Operations

Profile operations retrieve or update permitted user information.

Image-related functionality integrates with ImageKit where configured.

The backend must validate profile updates and enforce authorization before changing account information. Image operations should handle provider failures and invalid uploads without exposing credentials or internal implementation details.

Profile-photo upload behavior and supported file constraints should be verified against the current implementation and deployment configuration.

## 11. External Service Integrations

### Resend

Resend provides transactional email delivery through its API.

The integration depends on backend environment configuration, including `RESEND_API_KEY` and `EMAIL_FROM`.

Email operations should handle provider errors appropriately and avoid exposing sensitive provider details to the client.

### ImageKit

ImageKit is used for image-related integration.

The integration requires the relevant server-side configuration and credentials. Upload and deletion behavior should be documented according to the implemented service functions and associated controllers.

## 12. Error Handling

The backend uses a centralized error-handling approach to provide consistent failure responses.

Relevant error categories include:

- Request-validation failures
- Authentication failures
- Authorization failures
- Missing resources
- Database errors
- External-service failures
- Unexpected application errors

Error responses should use appropriate HTTP status codes and a consistent response structure.

The frontend should display understandable feedback while avoiding exposure of stack traces, secrets, or internal server details.

## 13. Testing Architecture

Jest is used for automated backend testing. Supertest is used for HTTP-level testing where configured.

The test setup mocks external ImageKit operations so tests can exercise application behavior without requiring live image-provider credentials.

Testing should cover:

- Authentication and authorization
- Request validation
- API routing
- Learning-entry operations
- Analytics calculations
- Profile operations
- Expected failures and error handling

The backend test suite has previously reported 83 passing tests across 7 test suites. This result represents a previously verified state and should be rechecked after code changes.

Refer to `TESTING_STRATEGY.md` for the test organization and execution instructions.

## 14. Deployment Architecture

The current deployment setup is:

| Component | Platform or Service |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB |
| Transactional email | Resend |
| Image integration | ImageKit |

The frontend communicates with the deployed backend through its configured API base URL. The backend connects to MongoDB and uses the configured external services.

Production configuration must include the correct environment variables, database access, CORS settings, and provider credentials.

Deployment changes should be followed by verification of authentication, email delivery, protected API access, learning-entry operations, analytics, and profile workflows.

## 15. Architecture Principles

- Separation of concerns between frontend and backend.
- Modular and maintainable application code.
- Consistent API contracts and error responses.
- Server-side validation and authorization.
- Strict ownership checks for private user data.
- Secure handling of credentials and tokens.
- Controlled integration with external services.
- Testable business logic and API behavior.
- Responsive and accessible user experience.
- Documentation aligned with the actual implementation.

## 16. Architecture Status

Skillora has progressed beyond the initial architecture-planning phase. The backend includes authentication, email verification, learning-entry APIs, analytics, profile operations, and automated tests. The application also has frontend and production deployment components.

Architecture documentation should evolve alongside implementation changes. Any change to API routes, authentication, database models, external services, or deployment configuration should be reflected in the relevant documentation.

The source code and configuration remain the authoritative references for exact implementation details.
