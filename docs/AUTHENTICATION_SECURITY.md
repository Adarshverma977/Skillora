# Skillora — Authentication and Security Design

## 1. Purpose

This document defines the initial authentication and security requirements for Skillora.

The objective is to protect student accounts, secure private learning data, and prevent unauthorized access to application resources.

## 2. Authentication Strategy

Skillora will use JWT-based authentication with a secure token-handling strategy.

The final implementation must define:

- Access-token lifetime.
- Token storage and transport.
- Token validation.
- Logout and token invalidation behavior.
- Session renewal or refresh-token requirements.
- Authentication behavior across browser refreshes.

These decisions must be finalized before authentication is implemented.

## 3. Password Security

- Passwords must never be stored in plaintext.
- Passwords must be hashed using bcrypt before storage.
- Password input must be validated against the application's password policy.
- Passwords and password hashes must never appear in ordinary API responses.
- Passwords must not be logged.
- Password-change operations must verify the current password where appropriate.
- Password-reset flows must use secure, expiring tokens.

## 4. Registration

The registration flow will follow these steps:

1. Validate the submitted name, email, and password.
2. Normalize the email consistently.
3. Check for an existing account with that email.
4. Hash the password.
5. Create the user with `isEmailVerified` set to `false`.
6. Generate a secure email-verification token.
7. Send the verification link through the configured email service.
8. Activate email verification only after the token has been validated.

The implementation must handle duplicate registrations and email-delivery failures safely.

## 5. Email Verification

- Verification tokens must be generated securely.
- Tokens must expire after a configured period.
- Tokens must be single-use.
- Token validation must be performed on the backend.
- Verification tokens must not be exposed in application logs.
- A resend-verification flow must be rate-limited.
- The login policy for unverified accounts must be enforced consistently.

The token-storage and expiry strategy will be finalized before implementation.

## 6. Login

The login process will:

1. Validate the submitted credentials.
2. Find the account using the normalized email.
3. Compare the supplied password with the stored hash.
4. Apply the account's email-verification policy.
5. Establish authentication using the selected token/session strategy.
6. Return only permitted user information.

Authentication failures should return safe messages without exposing sensitive account details.

## 7. Logout

Logout behavior must match the authentication design.

The implementation must ensure that client-side logout clears the relevant authentication state. If persistent sessions or refresh tokens are used, the backend must also invalidate the relevant session or token as appropriate.

A client deleting a token alone does not invalidate an otherwise valid server-accepted token.

## 8. Forgot Password and Reset Password

### Forgot Password

- Accept the account email.
- Return a generic response that does not reveal whether the account exists.
- Generate a secure, time-limited reset token for eligible accounts.
- Deliver the reset link through the configured email service.
- Apply rate limits to repeated requests.

### Reset Password

- Validate the submitted reset token.
- Reject expired or previously used tokens.
- Validate and hash the new password.
- Update the stored password hash.
- Invalidate the reset token after successful use.
- Review whether existing sessions must be invalidated after a password reset.

## 9. Protected Routes and API Authorization

Authentication middleware must validate the authentication credentials and establish the authenticated user's identity.

Authorization rules:

- Protected endpoints require authentication.
- Users may access only their own private learning entries.
- Entry reads, updates, and deletions must enforce ownership on the server.
- Client-provided user IDs must not be trusted as proof of ownership.
- Sensitive profile and account operations must validate permitted fields.
- Frontend route guards must not be treated as a security boundary.

## 10. Token and Secret Management

- JWT signing secrets must be stored in environment variables or an appropriate secret manager.
- Tokens must have an explicit expiration policy.
- JWT validation must verify the expected signature and claims.
- The application must reject malformed, expired, or otherwise invalid tokens.
- Authentication tokens must not be logged.
- Tokens should not be stored in browser local storage by default when a safer architecture is available.

The final cookie, CSRF, CORS, and refresh-token design must be selected together rather than independently.

## 11. API and Application Security

- Validate request bodies, query parameters, and route parameters.
- Use centralized error handling.
- Configure appropriate CORS rules.
- Apply security headers.
- Rate-limit sensitive authentication endpoints.
- Enforce request-size limits.
- Validate file uploads by size and permitted file type.
- Avoid returning stack traces or internal implementation details.
- Keep dependencies updated and review security advisories.
- Store database and email credentials outside source control.

## 12. Privacy and Logging

- Do not log passwords, authentication tokens, reset tokens, or verification tokens.
- Avoid unnecessarily collecting personal information.
- Exclude sensitive authentication fields from user responses.
- Use logs for debugging and security monitoring without exposing private data.
- Define an appropriate account-deletion and associated-data cleanup policy.

## 13. Security Testing

Authentication and authorization tests must cover:

- Registration with valid and invalid inputs.
- Duplicate email registration.
- Correct and incorrect login credentials.
- Unverified-account behavior.
- Expired and invalid verification tokens.
- Password-reset token expiry and reuse.
- Missing, malformed, and expired authentication credentials.
- Unauthorized access to another user's entries.
- Profile-update attempts involving restricted fields.
- Authentication rate limits and safe error responses.

## 14. Security Status

**Status:** Initial security design documented.

Security controls are requirements, not completed features. Each control must be implemented and tested before it is marked complete.