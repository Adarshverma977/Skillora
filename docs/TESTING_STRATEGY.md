# Skillora — Testing Strategy

## 1. Purpose

This document defines the testing approach for Skillora throughout development and before release.

The objective is to verify functional correctness, data security, API reliability, error handling, and a consistent user experience.

The strategy combines automated backend tests, manual API verification, and frontend behavior and responsive-layout checks.

## 2. Testing Principles

- Test features against documented requirements.
- Cover both successful and unsuccessful scenarios.
- Verify server-side validation independently of frontend validation.
- Test authorization using separate user accounts.
- Avoid marking features complete without evidence of verification.
- Keep tests repeatable and maintainable.
- Mock external services when appropriate.
- Fix and retest defects before release.
- Keep test configuration separate from production configuration.

## 3. Testing Tools and Levels

### 3.1 Unit Testing

Unit tests verify individual functions and isolated application logic.

Examples include:

- Request-validation logic
- Study-duration calculations
- Date-range calculations
- Analytics helpers
- Utility functions
- Authentication-related business logic

**Tool:** Jest.

### 3.2 Integration Testing

Integration tests verify how application components work together.

Examples include:

- Express routes and middleware
- Controllers and services
- Authentication and protected endpoints
- Learning-entry operations
- Profile updates
- Validation and error handling

**Tools:** Jest and Supertest where configured.

Database integration tests should use an appropriate isolated test environment. External services should be mocked where live credentials or network access are unnecessary.

### 3.3 API Testing

Postman is used for manual API verification.

API testing should cover:

- Request validation
- HTTP status codes
- Response structure
- Authentication requirements
- Authorization and data ownership
- Search and filters
- Analytics calculations
- Error handling
- External-service failures

### 3.4 Frontend and UX Testing

Frontend verification checks the behavior and visual quality of the React application.

Areas to verify include:

- Navigation
- Form validation
- Protected-page behavior
- Loading and empty states
- Success and error feedback
- Responsive layouts
- Theme behavior
- Keyboard interactions
- Correct rendering of API data

Automated browser testing can be introduced separately if required. Do not treat manual visual verification as equivalent to automated browser coverage.

## 4. Authentication Test Cases

- [ ] Register with valid details.
- [ ] Reject missing or invalid registration fields.
- [ ] Handle duplicate email registration.
- [ ] Verify that passwords are stored as hashes.
- [ ] Verify an account using a valid email-verification token.
- [ ] Reject invalid or expired verification tokens.
- [ ] Test login with correct credentials.
- [ ] Reject incorrect credentials.
- [ ] Verify the email-verification policy.
- [ ] Reject protected requests without authentication.
- [ ] Reject invalid or expired authentication credentials.
- [ ] Verify logout behavior according to the implemented authentication strategy.
- [ ] Test password-recovery responses for account-enumeration risks.
- [ ] Reject invalid, expired, or reused reset tokens where applicable.
- [ ] Verify successful password changes and resets.
- [ ] Test rate limiting on sensitive authentication endpoints where configured.
- [ ] Verify safe handling of Resend API failures.

## 5. Learning Journal Test Cases

- [ ] Create an entry with valid data.
- [ ] Reject missing or invalid required fields.
- [ ] Reject invalid study durations.
- [ ] Reject unsupported difficulty values.
- [ ] Reject malformed entry identifiers.
- [ ] Retrieve the authenticated user's entries.
- [ ] Retrieve an entry owned by the authenticated user.
- [ ] Update an owned entry.
- [ ] Delete an owned entry.
- [ ] Handle requests for nonexistent entries.
- [ ] Prevent one user from accessing another user's entries.
- [ ] Prevent one user from updating or deleting another user's entries.
- [ ] Verify that invalid updates do not corrupt existing data.

## 6. Dashboard and Analytics Test Cases

- [ ] Verify the total entry count.
- [ ] Verify aggregate study duration.
- [ ] Verify duration conversion and rounding rules.
- [ ] Verify weekly summaries at date boundaries.
- [ ] Verify the ordering of recently added entries.
- [ ] Verify productivity calculations against documented rules.
- [ ] Verify average session duration.
- [ ] Verify unique-topic counting, including case and surrounding whitespace.
- [ ] Verify empty-dashboard behavior.
- [ ] Confirm that analytics contain only the authenticated user's data.

## 7. Search and Filter Test Cases

- [ ] Search by topic name.
- [ ] Search using partial topic names, if supported.
- [ ] Handle empty search queries.
- [ ] Filter by difficulty.
- [ ] Filter by valid date ranges.
- [ ] Handle invalid date ranges.
- [ ] Combine supported search and filter parameters.
- [ ] Verify pagination and sorting where implemented.
- [ ] Verify that results never include another user's entries.

## 8. Profile Test Cases

- [ ] Retrieve the authenticated user's profile.
- [ ] Update permitted profile fields.
- [ ] Reject invalid profile values.
- [ ] Prevent unauthorized changes to restricted fields.
- [ ] Verify supported profile-photo operations.
- [ ] Reject unsupported image types where upload validation is implemented.
- [ ] Reject files exceeding the configured size limit.
- [ ] Verify image-upload failure handling.
- [ ] Verify photo replacement and cleanup behavior where supported.
- [ ] Change the password successfully.
- [ ] Reject an incorrect current password where required.
- [ ] Verify the new password works and the old password no longer works.

## 9. Frontend and UX Test Cases

- [ ] Verify navigation between public pages.
- [ ] Verify protected-page behavior.
- [ ] Verify form-validation messages.
- [ ] Verify submit buttons prevent unintended duplicate submissions.
- [ ] Verify loading indicators appear and disappear appropriately.
- [ ] Verify empty states and error messages.
- [ ] Verify toast notifications for important actions.
- [ ] Verify that forms remain usable on mobile screens.
- [ ] Check for horizontal overflow at supported viewport sizes.
- [ ] Verify visible keyboard focus and accessible labels.
- [ ] Verify that important controls can be operated without a mouse.
- [ ] Verify Poppins typography and consistent styling.
- [ ] Verify light and dark themes where implemented.
- [ ] Verify that the mobile navigation and page layout behave correctly.

## 10. External-Service Testing

### Resend

Test the email integration for:

- Successful email submission to Resend.
- Missing API configuration.
- Provider-reported errors.
- Network or provider failures.
- Safe error handling without exposing credentials.

A successful API submission indicates that Resend accepted the request; it does not by itself prove final delivery to the recipient's inbox.

### ImageKit

Where image operations are tested:

- Mock ImageKit operations in unit and route tests where appropriate.
- Verify upload and deletion error handling.
- Test validation of file type and size.
- Use an isolated environment for tests that require real provider integration.

The current Jest setup mocks ImageKit operations so automated tests do not require live image-provider credentials for those mocked paths.

## 11. Regression Testing

Whenever a defect is fixed or existing code changes, rerun the relevant tests to ensure previously working behavior has not broken.

High-priority regression areas include:

- Authentication and token handling
- Email verification and password recovery
- Learning-entry CRUD operations
- User ownership and authorization
- Search and filters
- Dashboard calculations
- Profile and password updates
- API validation and error handling
- Responsive layout and navigation

## 12. Test Environment and Data

- Use test-specific configuration and isolated test data.
- Never run destructive automated tests against production data.
- Use separate test accounts to verify ownership boundaries.
- Keep secrets out of test source code and version control.
- Clean up test data where appropriate.
- Use controlled dates and fixtures for reliable date-related tests.
- Mock external services when live integration is not the subject of the test.
- Keep test mocks separate from production service behavior.

## 13. Running Automated Tests

Run backend tests from the `server` directory:

```bash
npm test
```

Use the scripts defined in `server/package.json` as the source of truth for test commands.

The backend uses Jest and has a test setup file that mocks ImageKit operations.

## 14. Current Test Results

The latest recorded backend test result was:

| Metric | Recorded Result |
|---|---:|
| Passing test suites | 7 |
| Passing tests | 83 |
| Test runner | Jest |

These results reflect a previously reported test run. Re-run the suite to confirm the current result after code changes.

A passing backend suite does not automatically verify all frontend workflows, production deployment behavior, security controls, or third-party email delivery.

## 15. Defect Management

For each defect, record:

- Description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Severity and priority
- Fix status
- Retest result

A defect should be marked resolved only after the fix has been retested.

## 16. Release Acceptance Criteria

Before release:

- All project requirements must be implemented or explicitly documented as deferred.
- Critical authentication and authorization tests must pass.
- Access to user-owned data must be verified.
- Core journal and dashboard workflows must work correctly.
- Forms, validation, and error states must be checked.
- Responsive UI must be reviewed on supported screen sizes.
- Production environment configuration must be verified.
- Email and image integrations must be checked as appropriate.
- No known critical defects should remain.
- Regression tests must pass after release-critical changes.

## 17. Testing Status

Automated backend testing has been implemented using Jest, and the backend test suite has previously passed 83 tests across 7 test suites.

Postman is used for manual API verification. Frontend behavior, responsive layouts, production integrations, and security controls should be tracked separately according to their actual verification status.

Testing status must be updated from real test results rather than assumptions.
