# Skillora — API Specification

## 1. Overview

Skillora exposes a REST API built with Node.js and Express.js. The React frontend communicates with the backend using HTTP requests.

The API supports authentication, learning-journal management, dashboard analytics, and profile operations.

**API version prefix:** `/api/v1`

### Base URLs

**Local development:**

```text
http://localhost:5000/api/v1
```

**Production:**

```text
https://skillora-api-g3xe.onrender.com/api/v1
```

The production URL reflects the currently documented Render deployment. Verify the configured service URL if the deployment changes.

## 2. API Conventions

- Use appropriate HTTP methods and status codes.
- Use JSON for request and response bodies unless an endpoint requires another content type.
- Validate request bodies, route parameters, and query strings.
- Authenticate protected endpoints.
- Authorize access to user-owned resources on the server.
- Maintain consistent response and error-handling conventions.
- Never return password hashes or private credentials in ordinary API responses.
- Keep API secrets and external-service credentials on the server.
- Document endpoint behavior according to the actual route and controller implementation.

### Example Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Example Error Response

```json
{
  "success": false,
  "message": "A descriptive error message"
}
```

These are illustrative response formats. The actual response envelope, optional fields, and status codes must match the relevant controller and error-handling middleware.

## 3. Authentication Endpoints

The backend supports registration, email verification, login, logout, password recovery, and authenticated account operations.

The following table describes the intended endpoint responsibilities. Verify the exact route paths and HTTP methods against `server/src/routes` before treating this table as a definitive route inventory.

| Operation | Purpose | Access |
|---|---|---|
| Register | Create a student account | Public |
| Verify email | Verify a student's email address | Token-based |
| Login | Authenticate a student | Public |
| Logout | End the authenticated session according to the configured authentication strategy | Authenticated, if required by the route |
| Forgot password | Initiate password recovery | Public |
| Reset password | Set a new password using a valid reset token | Token-based |
| Get current user | Retrieve authenticated account information | Authenticated |
| Update profile | Update permitted profile information | Authenticated |
| Change password | Change the authenticated user's password | Authenticated |

### Authentication Requirements

- Validate registration and login inputs.
- Hash passwords before storing them.
- Reject invalid credentials.
- Apply the configured email-verification policy.
- Validate verification and password-reset tokens.
- Handle expired or previously used tokens appropriately.
- Avoid disclosing whether an email address exists in password-recovery responses.
- Apply rate limiting to sensitive authentication endpoints where configured.
- Ensure logout behavior matches the actual token or session implementation.

### Email Delivery

Transactional email delivery uses the Resend API.

The backend configuration includes:

- `RESEND_API_KEY`
- `EMAIL_FROM`

Email-provider errors should be handled without exposing credentials or sensitive internal details to the client.

## 4. Learning Journal Endpoints

Skillora provides backend operations for creating, retrieving, updating, and deleting learning entries.

| Operation | Purpose | Access |
|---|---|---|
| Create entry | Create a learning-journal record | Authenticated |
| List entries | Retrieve the user's learning entries | Authenticated |
| Get entry | Retrieve one learning entry | Authenticated |
| Update entry | Update an existing learning entry | Authenticated |
| Delete entry | Delete an existing learning entry | Authenticated |

The exact endpoint paths and HTTP methods must be verified against the current entry route module.

### Example Create Entry Request

The following illustrates the intended learning-entry data. Confirm the actual accepted fields and date behavior against the Zod schema and controller.

```json
{
  "topic": "JavaScript Closures",
  "description": "Studied lexical scope and closures",
  "studyDurationMinutes": 90,
  "difficulty": "Medium"
}
```

Include `learningDate` only if the actual schema and API accept it.

### Listing, Search, and Filtering

The learning-journal API supports search and filtering capabilities according to the implemented query-validation and controller logic.

Potential parameters include:

- Topic search
- Date-based filtering
- Difficulty
- Pagination
- Sorting

The exact parameter names, supported combinations, default values, and pagination behavior must be verified against the current query schema and entry service. Do not assume that every parameter listed here is supported.

### Ownership Requirements

- Return only entries belonging to the authenticated user.
- Verify ownership before updating or deleting an entry.
- Reject invalid identifiers appropriately.
- Do not trust a client-supplied user ID as proof of ownership.

## 5. Dashboard and Analytics

The backend includes dashboard-statistics and learning-entry analytics functionality.

Supported analytics include:

- Total learning-entry count
- Aggregate study duration
- Weekly learning summaries
- Recently added entries or topics, where exposed by the relevant API
- Average session duration
- Unique-topic counts

The precise endpoint paths and response fields must be confirmed against the current dashboard and entry-analytics route modules.

### Analytics Requirements

- Restrict all calculations to the authenticated user's data.
- Use consistent duration units.
- Handle empty datasets and zero-entry users.
- Define date boundaries consistently.
- Normalize topic names for unique-topic calculations where required.
- Return results that match the actual database aggregation logic.

## 6. Profile Endpoints

The backend includes profile retrieval and profile-update functionality.

| Operation | Purpose | Access |
|---|---|---|
| Get profile | Retrieve the authenticated user's profile | Authenticated |
| Update profile | Update permitted profile fields | Authenticated |
| Change password | Change account credentials | Authenticated |
| Update profile photo | Update the profile image, if exposed through a configured route | Authenticated |

Verify the exact route paths, methods, and upload behavior against the current user route module and profile controller.

### Profile Update Requirements

- Allow only explicitly permitted fields.
- Prevent updates to password hashes and protected authentication fields through a general profile-update operation.
- Validate incoming data.
- Return only appropriate user information.
- Handle missing users and invalid updates consistently.

### Profile Photo

Image-related operations integrate with ImageKit where configured.

Upload behavior, accepted content types, file-size limits, deletion support, and error responses must be documented from the implemented route and upload middleware.

## 7. Request Validation

Zod is used for backend request validation.

Validation should cover the fields and parameters relevant to each endpoint.

Examples of validation requirements include:

- Required fields and string length limits
- Supported difficulty values
- Valid study durations
- Valid date inputs and date ranges
- Valid identifiers
- Supported query parameters
- Permitted profile fields

The exact rules must come from the current Zod schemas. Invalid input should be rejected before the associated operation modifies application data.

## 8. HTTP Status Codes

The following status codes are common API conventions. The actual status returned by each endpoint must match its implementation.

| Status | Meaning |
|---|---|
| `200` | Successful request |
| `201` | Resource created |
| `204` | Successful request with no response body |
| `400` | Invalid request |
| `401` | Authentication required or invalid |
| `403` | Authenticated but not permitted |
| `404` | Resource not found or not accessible |
| `409` | Resource conflict, such as duplicate email |
| `413` | Request or upload exceeds a configured limit |
| `415` | Unsupported media type |
| `422` | Semantically invalid input, if used by the API |
| `429` | Rate limit exceeded |
| `500` | Unexpected server error |
| `503` | Service temporarily unavailable, where explicitly handled |

The backend should not expose stack traces, credentials, or internal server configuration in client-facing errors.

## 9. Pagination and Response Formats

Pagination must be documented according to the current entry-list implementation.

If pagination is supported, a response may contain:

```json
{
  "success": true,
  "message": "Entries retrieved successfully",
  "data": {
    "entries": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalEntries": 0,
      "totalPages": 0,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

This is an illustrative structure, not a guarantee of the current API response. Confirm the actual response fields, page defaults, maximum limits, and empty-result behavior in the controller and service.

## 10. API Testing

The backend uses Jest for automated testing. Supertest is used for HTTP-level tests where configured, and Postman supports manual API verification.

API testing should cover:

- Valid requests
- Invalid request bodies and query parameters
- Missing or invalid authentication
- Unauthorized access to another user's resources
- Missing resources
- Duplicate-account and other conflict scenarios
- Email-provider failures
- Database and unexpected server errors
- Correct status codes and response formats

The backend test suite has previously reported **83 passing tests across 7 test suites**. Re-run the tests after changes to API routes, validation, controllers, or authentication behavior.

## 11. Keeping the Specification Accurate

Before documenting an endpoint as part of the final API contract:

1. Verify its route path and HTTP method in the route module.
2. Inspect its controller and relevant service.
3. Check the associated Zod validation schema.
4. Record authentication and authorization requirements.
5. Verify the request and response formats.
6. Test success and failure cases using automated tests or Postman.

Update this document whenever an endpoint, validation rule, response format, or authentication requirement changes.

## 12. API Specification Status

Skillora has implemented backend functionality for authentication, email verification, learning-entry operations, analytics, and profile management.

This document describes the API's main responsibilities and conventions. The exact route inventory, request schemas, response envelopes, and status codes must be reconciled with the current backend source code before this document is treated as a complete endpoint reference.
