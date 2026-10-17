# Skillora — API Specification

## 1. Overview

Skillora will expose a REST API using Node.js and Express.js. The frontend will communicate with the backend using HTTP requests and JSON payloads.

**Base URL (development):**

`http://localhost:5000/api/v1`

The port and base path may be adjusted during server configuration.

## 2. API Conventions

- Use appropriate HTTP methods and status codes.
- Use JSON for request and response bodies unless an endpoint requires another content type.
- Validate request parameters, query strings, and request bodies.
- Authenticate protected endpoints.
- Authorize access to user-owned resources on the server.
- Use a consistent response structure.
- Never return password hashes, authentication secrets, or private token values in ordinary API responses.

### Standard Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Standard Error Response

```json
{
  "success": false,
  "message": "A descriptive error message",
  "errors": []
}
```

The `data` and `errors` fields may be adapted for endpoints that need different response shapes. The final response contract must remain consistent.

## 3. Authentication Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a student | Public |
| POST | `/auth/login` | Authenticate a student | Public |
| POST | `/auth/logout` | End the authenticated session | Authenticated |
| GET | `/auth/verify-email` | Verify email using a token | Token-based |
| POST | `/auth/resend-verification` | Request another verification email | Public, rate-limited |
| POST | `/auth/forgot-password` | Request a password-reset link | Public, rate-limited |
| POST | `/auth/reset-password` | Set a new password using a reset token | Token-based |
| GET | `/auth/me` | Get the current authenticated user | Authenticated |
| PATCH | `/auth/change-password` | Change the current password | Authenticated |

### Authentication Notes

- Registration and login inputs must be validated.
- Login responses must follow the selected authentication strategy.
- Verification and password-reset tokens must expire and be single-use.
- Responses to password-recovery requests should avoid revealing whether an email address exists.
- Authentication endpoints must have appropriate rate limits.
- Logout behavior must match the chosen session or token invalidation design.

## 4. Learning Journal Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/entries` | Create a learning entry | Authenticated |
| GET | `/entries` | List the user's entries | Authenticated |
| GET | `/entries/:id` | Get one entry | Authenticated |
| PATCH | `/entries/:id` | Update an entry | Authenticated |
| DELETE | `/entries/:id` | Delete an entry | Authenticated |

### Create Entry Request

`POST /entries`

```json
{
  "topic": "JavaScript Closures",
  "description": "Studied lexical scope and closures",
  "studyDurationMinutes": 90,
  "difficulty": "Medium",
  "learningDate": "2026-10-17"
}
```

### List Entries Query Parameters

`GET /entries`

Supported parameters:

- `page`: Page number.
- `limit`: Number of entries per page.
- `search`: Search topic names.
- `difficulty`: Filter by `Easy`, `Medium`, or `Hard`.
- `dateFrom`: Start of the date range.
- `dateTo`: End of the date range.
- `sortBy`: Supported sort field.
- `order`: `asc` or `desc`.

The backend must validate pagination and sorting parameters and return only entries owned by the authenticated user.

### Update Entry

`PATCH /entries/:id`

Accepts only supported, validated fields. The backend must verify ownership before applying changes.

### Delete Entry

`DELETE /entries/:id`

Deletes an entry only after confirming that it belongs to the authenticated user.

## 5. Dashboard Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/dashboard/overview` | Get total entries, study time, and productivity metrics | Authenticated |
| GET | `/dashboard/weekly-summary` | Get weekly learning activity | Authenticated |
| GET | `/dashboard/recent-entries` | Get recently created entries | Authenticated |

### Dashboard Response Data

Dashboard responses may include:

- Total entries.
- Total study duration in minutes.
- Display-ready study hours.
- Weekly entry counts and study duration.
- Recently added topics.
- Defined productivity metrics.

All calculations must use the authenticated user's data and documented date boundaries.

## 6. Profile Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/users/me` | Get the current user's profile | Authenticated |
| PATCH | `/users/me` | Update profile information | Authenticated |
| PATCH | `/users/me/photo` | Upload or update profile photo | Authenticated |
| DELETE | `/users/me/photo` | Remove profile photo if supported | Authenticated |

### Profile Update

Only explicitly permitted profile fields may be updated. Sensitive fields such as email-verification status and password hashes must not be writable through the general profile endpoint.

### Profile Photo

The upload endpoint will use the content type and validation rules defined during implementation. File size, allowed formats, storage, and cleanup behavior must be configured and tested.

## 7. Validation Rules

- Reject missing or invalid required fields.
- Enforce string length limits.
- Accept only supported difficulty values.
- Require valid positive study durations within configured limits.
- Validate dates and date ranges.
- Reject malformed identifiers.
- Reject unsupported sort fields and invalid pagination values.
- Prevent clients from assigning ownership to another user.
- Return useful validation messages without exposing internal details.

## 8. HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 204 | Successful request with no response body |
| 400 | Invalid request |
| 401 | Authentication required or invalid |
| 403 | Authenticated but not permitted |
| 404 | Resource not found or not accessible |
| 409 | Resource conflict, such as duplicate email |
| 413 | Upload exceeds configured size limit |
| 415 | Unsupported media type |
| 422 | Semantically invalid input, if adopted consistently |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error |

The application will use a consistent status-code policy. It will not expose stack traces or internal errors to clients.

## 9. Pagination Response

A paginated entries response may use the following structure:

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

The actual values must be calculated from the query results.

## 10. API Testing

Each endpoint must be tested for:

- Valid requests.
- Invalid request bodies and query parameters.
- Missing or invalid authentication.
- Unauthorized access to another user's resources.
- Missing resources.
- Database and unexpected server errors.
- Correct HTTP status codes and response structure.

Postman collections and automated tests will be added during backend development.

## 11. API Specification Status

**Status:** Initial endpoint design documented.

Request schemas, response schemas, authentication mechanics, and endpoint behavior must be finalized and verified during implementation.