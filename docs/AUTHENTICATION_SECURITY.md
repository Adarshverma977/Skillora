# Skillora — Authentication and Security Design

## 1. Purpose

This document describes the authentication architecture and security requirements for Skillora.

The objective is to protect student accounts, secure private learning data, and prevent unauthorized access to application resources.

Skillora includes JWT-based authentication, password hashing, email verification, password recovery, protected API endpoints, and user-specific data access controls.

Security behavior must remain consistent with the actual backend implementation and be verified through automated tests.

## 2. Authentication Architecture

Skillora uses JSON Web Tokens (JWT) for authentication.

The backend includes authentication middleware for protecting private endpoints and identifying the authenticated user.

The following behaviors must be verified against the current authentication implementation:

- Access-token lifetime and claims.
- Token storage and transport.
- Token validation and expiration handling.
- Logout and token invalidation behavior.
- Session renewal or refresh-token support, if implemented.
- Authentication persistence across browser refreshes.
- Cookie security attributes and CSRF protections, if cookies are used.

Do not assume that JWT authentication automatically provides server-side session invalidation. Logout and token-revocation behavior depend on the implemented strategy.

## 3. Password Security

Skillora uses password hashing for account security.

Security requirements include:

- Never store passwords in plaintext.
- Hash passwords before storing them.
- Validate passwords against the application's configured password policy.
- Never include password hashes in ordinary API responses.
- Never log passwords or password hashes.
- Verify the current password for password-change operations where required.
- Validate and securely process password-reset requests.
- Avoid exposing authentication-related implementation details through errors.

The precise password policy and hashing configuration should be verified against the User model and authentication services.

## 4. Registration

The registration workflow includes the following logical steps:

1. Receive the student's registration details.
2. Validate the submitted data.
3. Normalize and validate the email address according to the implementation.
4. Handle duplicate email addresses.
5. Hash the password before persistence.
6. Create the user account with the appropriate verification state.
7. Initiate the email-verification workflow.
8. Return an appropriate response to the client.

The backend has implemented registration and email-verification functionality.

The exact order of database writes, duplicate-account handling, rollback behavior, and verification-token storage must be confirmed from the current authentication service and User model.

## 5. Email Verification

Email verification helps establish ownership of the account's email address.

The application supports an email-verification workflow using the configured transactional email service.

Security requirements include:

- Generate verification tokens securely.
- Validate verification tokens on the backend.
- Enforce the configured token-expiry behavior.
- Prevent inappropriate token reuse.
- Avoid logging verification tokens.
- Apply suitable limits to repeated verification requests where configured.
- Enforce the configured login policy for unverified accounts.

The exact token-generation algorithm, storage format, expiry period, and resend-verification behavior must match the current implementation.

### Email Delivery Provider

Skillora uses **Resend** for transactional email delivery through its HTTP API.

The backend configuration includes:

- `RESEND_API_KEY`
- `EMAIL_FROM`

Email-provider failures should be handled safely without exposing API keys or other sensitive configuration.

Direct SMTP credentials are not required for the current Resend API integration.

## 6. Login

The login workflow includes the following steps:

1. Receive and validate the login credentials.
2. Locate the relevant account.
3. Compare the submitted password against the stored password hash.
4. Apply the configured account-verification policy.
5. Establish authenticated access using the implemented JWT mechanism.
6. Return the permitted account information and authentication result.

Authentication failures should produce safe and consistent responses.

Responses should not unnecessarily reveal sensitive account details or internal authentication logic.

The exact token-delivery mechanism, token lifetime, and response structure must be verified against the current login controller and authentication middleware.

## 7. Logout

Logout behavior must match the actual authentication design.

The client should clear its local authenticated state when logout completes.

If the application uses persistent sessions, refresh tokens, token revocation, or server-managed session state, the relevant server-side invalidation behavior must also be implemented.

If logout only removes a client-held JWT, that action does not automatically invalidate an otherwise valid token presented elsewhere.

Document and test the actual logout behavior rather than assuming a specific invalidation mechanism.

## 8. Forgot Password and Reset Password

Skillora includes a password-recovery workflow.

### 8.1 Forgot Password

The workflow should:

- Accept a password-recovery request.
- Validate the request.
- Generate a reset token for an eligible account.
- Deliver the reset link through the configured email service.
- Return a safe response that does not unnecessarily reveal whether an account exists.
- Apply suitable rate limits where configured.

### 8.2 Reset Password

The workflow should:

- Validate the supplied reset token.
- Reject invalid, expired, or previously used tokens as required.
- Validate the new password.
- Hash the new password before storing it.
- Invalidate the reset token after successful use.
- Consider whether existing authentication sessions should be invalidated.

The exact token lifetime, persistence strategy, account-enumeration protections, and session-invalidation behavior must be verified against the current implementation.

## 9. Protected Routes and Authorization

The backend uses authentication middleware to protect private API operations.

Authorization must be enforced independently of frontend navigation.

### Data Ownership Rules

- Protected endpoints must require valid authentication.
- The backend must derive the authenticated user's identity from the verified authentication context.
- Users may access only their own private learning entries.
- Entry retrieval, updates, and deletions must enforce ownership.
- Dashboard analytics must be restricted to the authenticated user's records.
- Client-provided user IDs must not be trusted as proof of ownership.
- Profile operations must allow only permitted fields.

Knowing a resource identifier does not grant authorization to access the resource.

## 10. Token and Secret Management

JWT authentication requires secure token handling.

The application should:

- Keep JWT signing secrets in environment variables or an appropriate secret manager.
- Enforce the configured token-expiration policy.
- Validate JWT signatures and required claims.
- Reject malformed, expired, or otherwise invalid tokens.
- Avoid logging authentication tokens.
- Keep provider credentials and other secrets out of source control.
- Use an appropriate token-storage strategy for the application's threat model.

The exact token-storage mechanism must be confirmed from the implementation.

If authentication uses cookies, configure appropriate `HttpOnly`, `Secure`, and `SameSite` attributes and assess CSRF protections. If it uses another transport mechanism, document its relevant security controls instead.

CORS configuration, cookie settings, CSRF protection, and token transport must be designed together where applicable.

## 11. API and Application Security

The backend should enforce the following controls according to the current implementation and deployment requirements:

- Validate request bodies, query parameters, and route parameters.
- Use centralized error handling.
- Configure appropriate CORS rules.
- Apply suitable HTTP security headers.
- Rate-limit sensitive authentication endpoints where configured.
- Enforce request-size limits.
- Validate uploaded files by permitted type and size.
- Avoid exposing stack traces and internal configuration.
- Keep dependencies updated and review relevant security advisories.
- Store database, JWT, Resend, and image-provider credentials outside source control.
- Handle database and external-service failures safely.

The presence of a security requirement in this document does not by itself prove that the control has been configured.

## 12. Privacy and Logging

The application should protect sensitive account and authentication information.

- Do not log passwords, password hashes, or authentication tokens.
- Avoid logging verification and reset tokens.
- Do not expose private authentication fields in profile responses.
- Avoid collecting unnecessary personal information.
- Keep application logs useful for troubleshooting without exposing private data.
- Define appropriate account-deletion and associated-data cleanup behavior.
- Ensure test and production credentials are handled separately.

## 13. Security Testing

Authentication and authorization tests should cover:

- Registration with valid and invalid inputs.
- Duplicate email registration.
- Correct and incorrect login credentials.
- Email-verification behavior.
- Invalid, expired, and reused verification tokens.
- Forgot-password and reset-password behavior.
- Invalid or expired authentication credentials.
- Unauthorized access to another user's learning entries.
- Restricted profile-field updates.
- Password-change validation.
- Safe handling of email-provider failures.
- Consistent API error responses.

The backend has a Jest-based automated test suite. The latest documented result was **83 passing tests across 7 test suites**.

These results should be rechecked after significant authentication or security changes. Passing tests do not automatically establish that every security requirement in this document has been implemented.

## 14. Security Configuration

The authentication and external-service configuration may include:

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | JWT signing or verification secret, depending on implementation |
| `MONGODB_URI` | Database connection |
| `RESEND_API_KEY` | Resend API authentication |
| `EMAIL_FROM` | Transactional email sender identity |

Other environment variables may be required for frontend origins, cookie behavior, token expiration, or image-provider configuration.

Verify exact names and usage against the current source code. Never commit production secrets or populate documentation with real credentials.

## 15. Security Status

Skillora has implemented authentication-related backend functionality, email verification, password-recovery workflows, protected API operations, and automated tests.

Email delivery uses Resend rather than a direct SMTP connection.

Security maturity must be assessed control by control. Token transport, session invalidation, rate limiting, cookie attributes, CSRF protection, and other deployment-dependent controls should be marked complete only after reviewing the implementation and verifying the relevant behavior.

Update this document whenever the authentication architecture, token strategy, security configuration, or external-service integration changes.
