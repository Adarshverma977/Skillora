# Skillora — Testing Strategy

## 1. Purpose

This document defines how Skillora will be tested during development and before release.

The objective is to verify functional correctness, data security, API reliability, responsive design, and a consistent user experience.

## 2. Testing Principles

- Test features against the documented requirements.
- Test both successful and unsuccessful scenarios.
- Verify server-side validation independently of frontend validation.
- Test authorization using multiple user accounts.
- Avoid marking features complete without evidence of verification.
- Keep tests repeatable and maintainable.
- Fix and retest defects before release.

## 3. Testing Levels

### Unit Testing

Tests individual functions and isolated logic.

Examples:
- Input validation.
- Study-duration calculations.
- Date-range calculations.
- Dashboard aggregation helpers.
- Utility functions.

**Planned tool:** Vitest.

### Integration Testing

Tests how application modules work together.

Examples:
- Express routes with middleware and controllers.
- Controllers and services interacting with database models.
- Authentication and protected endpoints.
- Learning-entry CRUD operations.
- Profile update workflows.

**Planned tools:** Vitest and Supertest, with a suitable test database.

### API Testing

Verifies endpoint behavior through HTTP requests.

**Planned tool:** Postman.

Tests must cover:
- Request validation.
- HTTP status codes.
- Response structure.
- Authentication requirements.
- Authorization and ownership.
- Pagination, search, and filters.
- Error handling.

### UI Testing

Verifies frontend behavior and visual quality.

Tests must cover:
- Navigation.
- Form validation.
- Loading and empty states.
- Success and error feedback.
- Responsive layouts.
- Keyboard interactions.
- Correct rendering of API data.

Automated browser testing may be added when the frontend structure is established.

## 4. Authentication Test Cases

- [ ] Register with valid details.
- [ ] Reject missing or invalid registration fields.
- [ ] Handle duplicate email registration.
- [ ] Verify password hashing.
- [ ] Verify email using a valid token.
- [ ] Reject expired or invalid verification tokens.
- [ ] Test login with correct credentials.
- [ ] Reject incorrect credentials.
- [ ] Enforce the email-verification policy.
- [ ] Reject protected requests without authentication.
- [ ] Reject invalid or expired authentication credentials.
- [ ] Verify logout behavior.
- [ ] Test forgot-password requests without exposing account existence.
- [ ] Reject expired or reused reset tokens.
- [ ] Verify successful password changes and resets.
- [ ] Test rate limits on sensitive authentication endpoints.

## 5. Learning Journal Test Cases

- [ ] Create an entry with valid data.
- [ ] Reject missing or invalid required fields.
- [ ] Reject invalid study durations.
- [ ] Reject unsupported difficulty values.
- [ ] Reject malformed entry IDs.
- [ ] Retrieve the authenticated user's entries.
- [ ] Retrieve a single owned entry.
- [ ] Update an owned entry.
- [ ] Delete an owned entry.
- [ ] Handle requests for nonexistent entries.
- [ ] Prevent one user from accessing another user's entries.
- [ ] Prevent one user from updating or deleting another user's entries.

## 6. Dashboard Test Cases

- [ ] Verify the total entry count.
- [ ] Verify aggregate study duration.
- [ ] Verify hour conversion and rounding rules.
- [ ] Verify weekly summaries at date boundaries.
- [ ] Verify recently added entries are ordered correctly.
- [ ] Verify productivity calculations against documented rules.
- [ ] Verify empty-dashboard behavior.
- [ ] Confirm that dashboard data belongs only to the authenticated user.

## 7. Search and Filter Test Cases

- [ ] Search by topic name.
- [ ] Search with partial topic names.
- [ ] Handle empty search queries.
- [ ] Filter by difficulty.
- [ ] Filter by a valid date range.
- [ ] Handle invalid date ranges.
- [ ] Combine search and filters.
- [ ] Verify pagination with active filters.
- [ ] Verify that results never include another user's entries.

## 8. Profile Test Cases

- [ ] Retrieve the current user's profile.
- [ ] Update permitted profile fields.
- [ ] Reject invalid profile values.
- [ ] Prevent unauthorized changes to restricted fields.
- [ ] Upload a supported profile image.
- [ ] Reject unsupported image types.
- [ ] Reject files exceeding the configured size limit.
- [ ] Verify profile-photo replacement and cleanup behavior.
- [ ] Change the password successfully.
- [ ] Reject an incorrect current password where required.
- [ ] Verify the new password works and the old password no longer works.

## 9. Frontend and UX Test Cases

- [ ] Verify navigation between public pages.
- [ ] Verify protected-page behavior.
- [ ] Verify form validation messages.
- [ ] Verify submit buttons prevent duplicate submissions.
- [ ] Verify loading indicators appear and disappear appropriately.
- [ ] Verify empty states and error messages.
- [ ] Verify toast notifications for important actions.
- [ ] Verify forms remain usable on mobile screens.
- [ ] Check for horizontal overflow at supported viewport sizes.
- [ ] Verify visible keyboard focus and accessible labels.
- [ ] Verify that important controls are usable without a mouse.
- [ ] Verify consistent Poppins typography and design tokens.

## 10. Regression Testing

Whenever a defect is fixed or existing code changes, rerun relevant tests to ensure previously working behavior has not broken.

High-priority regression areas:
- Authentication and session handling.
- Learning-entry CRUD operations.
- User ownership and authorization.
- Search, filters, and pagination.
- Dashboard calculations.
- Profile and password updates.
- Responsive layout and navigation.

## 11. Test Environment and Data

- Use test-specific configuration and database data.
- Never run destructive automated tests against production data.
- Use separate test accounts to verify ownership boundaries.
- Keep secrets out of test source code and version control.
- Clean up test data where appropriate.
- Use controlled dates and fixtures for reliable date-related tests.

## 12. Defect Management

For each defect, record:
- Description.
- Steps to reproduce.
- Expected behavior.
- Actual behavior.
- Severity and priority.
- Fix status.
- Retest result.

A defect is not resolved until the fix has been retested.

## 13. Release Acceptance Criteria

Before release:

- All 34 original project requirements must be implemented or explicitly documented as deferred.
- Critical authentication and authorization tests must pass.
- User-owned data access must be verified.
- Core journal and dashboard workflows must work correctly.
- Forms and error states must be checked.
- Responsive UI must be visually reviewed.
- No known critical defects may remain.
- Production environment configuration must be verified.

## 14. Testing Status

**Status:** Testing strategy documented.

Tests have not yet been implemented or executed. Completion will be based on actual test results, not assumptions.