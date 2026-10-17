# Skillora — Project Architecture

## 1. Architecture Overview

Skillora will follow a modular client-server architecture using the MERN stack.

The React frontend will communicate with the Express REST API over HTTP. The backend will validate requests, apply business rules, authenticate users, and interact with MongoDB through Mongoose.

## 2. High-Level Architecture

```text
┌─────────────────────────────┐
│        Student/User         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      React Frontend         │
│                             │
│ Pages, Components, Forms    │
│ API Services, UI State      │
└──────────────┬──────────────┘
               │ HTTP / JSON
               ▼
┌─────────────────────────────┐
│     Express REST API        │
│                             │
│ Routes and Middleware       │
│ Controllers and Services    │
│ Validation and Error Logic  │
└──────────────┬──────────────┘
               │ Mongoose
               ▼
┌─────────────────────────────┐
│          MongoDB            │
│                             │
│ Users and Learning Entries  │
└─────────────────────────────┘
```

## 3. Frontend Architecture

The frontend will be responsible for:

- Rendering responsive pages and reusable components.
- Handling navigation and protected-page access.
- Collecting and validating user input.
- Calling backend API endpoints.
- Displaying loading, empty, success, and error states.
- Showing dashboard statistics returned or calculated by the backend.

Frontend route protection improves the user experience but does not replace backend authorization.

## 4. Backend Request Lifecycle

A typical API request will follow this flow:

1. The client sends an HTTP request.
2. Express receives the request and matches the route.
3. Middleware performs required authentication, validation, and other checks.
4. The controller coordinates the requested operation.
5. The service layer handles business logic where appropriate.
6. Mongoose reads or updates MongoDB.
7. The backend returns a consistent JSON response.
8. The frontend updates the interface.

Errors will be passed to centralized error-handling middleware.

## 5. Authentication Flow

### Registration

1. The student submits registration details.
2. The backend validates the input.
3. The password is hashed before storage.
4. An email-verification process is initiated.
5. The account's verification state is updated after successful verification.

### Login

1. The student submits login credentials.
2. The backend validates the credentials.
3. The backend applies the account-verification policy.
4. The authentication mechanism establishes an authenticated session.
5. Protected requests are authorized using the selected token/session strategy.

### Protected Requests

1. The client sends an authenticated request.
2. Authentication middleware validates the session or token.
3. The backend identifies the authenticated user.
4. Authorization checks ensure that the user can access the requested resource.
5. The backend processes the request only when the required checks pass.

### Password Recovery

1. The student requests a password reset.
2. The backend initiates a secure, time-limited reset flow.
3. The student follows the reset link.
4. The backend validates the reset token.
5. The new password is securely hashed and saved.
6. The reset token is invalidated.

Exact token storage, expiry, and invalidation rules will be defined in the authentication design.

## 6. Database Architecture

The initial data model will include:

### User

Stores student account information, authentication-related fields, profile details, and verification status.

### Learning Entry

Stores a student's learning journal entry, including its topic, description, study duration, difficulty, and relevant dates.

Every learning entry must be associated with its owning user.

**Data ownership rule:** The backend must scope queries and mutations to the authenticated user's identity. Knowing another entry's ID must not grant access to that entry.

Detailed schemas, constraints, and indexes will be documented before database implementation.

## 7. Dashboard Data Flow

The dashboard will use the authenticated student's journal data to display:

- Total learning entries.
- Total study time.
- Weekly learning activity.
- Recently added topics.
- Productivity information.

Dashboard queries must respect the same user-ownership rules as ordinary journal endpoints. Study-time calculations must use a consistent duration unit and clearly defined date boundaries.

## 8. Search and Filtering Flow

The client will send supported search and filter parameters to the API.

The backend will validate those parameters and retrieve only the authenticated user's matching entries.

Supported filters:

- Topic-name search.
- Date range.
- Difficulty level.

Combined filters must work consistently when multiple filters are applied together.

## 9. Error Handling

The backend will use centralized error-handling middleware and a consistent response format.

The application will distinguish validation errors, authentication failures, authorization failures, missing resources, and unexpected server errors.

The frontend will display understandable messages without exposing secrets, stack traces, or internal server details.

## 10. Architecture Principles

- Separation of concerns.
- Reusable frontend components.
- Modular backend organization.
- Server-side authorization for protected data.
- Consistent API contracts.
- Input validation at trust boundaries.
- Secure handling of credentials and tokens.
- Maintainable and testable code.
- Responsive and accessible user experience.

## 11. Architecture Status

**Status:** Initial architecture documented.

The architecture will be refined as API contracts, database schemas, authentication design, and deployment requirements are finalized.