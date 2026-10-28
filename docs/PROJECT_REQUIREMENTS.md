# Skillora — Project Requirements

## 1. Project Overview

**Project Name:** Skillora
**Project Type:** Full-Stack MERN Application
**Product Category:** Student Learning Journal
**Primary Goal:** Help students record daily learning activities, track study time, analyze learning progress, and build consistent study habits.

Skillora provides authenticated students with a personal learning journal, dashboard analytics, search and filtering, and profile management.

## 2. Functional Requirements

Requirement status must reflect verified implementation and testing. A feature must not be marked complete solely because its code or UI exists.

### Module 1: Authentication and Account Security

- [x] **AUTH-01:** Register a student account.
- [x] **AUTH-02:** Log in using valid credentials.
- [x] **AUTH-03:** Log out and invalidate the active authentication session according to the implemented authentication strategy.
- [x] **AUTH-04:** Send an email verification message after registration.
- [x] **AUTH-05:** Verify an account using a valid verification token.
- [x] **AUTH-06:** Initiate the forgot-password workflow.
- [x] **AUTH-07:** Reset a password using a valid, unexpired reset token.
- [x] **AUTH-08:** Authenticate requests using JWT-based authentication.
- [x] **AUTH-09:** Protect private routes and API endpoints.
- [x] **AUTH-10:** Retrieve the authenticated user's account information.
- [x] **AUTH-11:** Handle invalid credentials, expired tokens, and authentication failures consistently.

### Module 2: Learning Journal

- [x] **JOURNAL-01:** Create a learning entry.
- [x] **JOURNAL-02:** Record the topic name.
- [x] **JOURNAL-03:** Record a learning description.
- [x] **JOURNAL-04:** Record study duration in minutes.
- [x] **JOURNAL-05:** Select a difficulty level.
- [x] **JOURNAL-06:** Retrieve the authenticated user's learning entries.
- [x] **JOURNAL-07:** Retrieve the details of an individual entry.
- [x] **JOURNAL-08:** Update an existing learning entry.
- [x] **JOURNAL-09:** Delete a learning entry.
- [x] **JOURNAL-10:** Associate each entry with its owner and prevent unauthorized access to another user's entries.

### Module 3: Dashboard and Analytics

- [x] **DASH-01:** Display the total number of learning entries.
- [x] **DASH-02:** Calculate aggregate study duration and present it in an understandable format.
- [x] **DASH-03:** Display a weekly learning summary.
- [x] **DASH-04:** Display recently added learning topics or entries.
- [x] **DASH-05:** Provide a productivity overview.
- [x] **DASH-06:** Calculate analytics using the authenticated user's data.
- [x] **DASH-07:** Provide entry analytics, including average session duration and unique-topic counts where supported by the implementation.

### Module 4: Search and Filtering

- [x] **SEARCH-01:** Search learning entries by topic name.
- [x] **SEARCH-02:** Filter entries by date or date range.
- [x] **SEARCH-03:** Filter entries by difficulty level.
- [x] **SEARCH-04:** Combine supported search and filter parameters correctly.
- [x] **SEARCH-05:** Validate query parameters and return consistent responses for invalid input.

### Module 5: Profile Management

- [x] **PROFILE-01:** Retrieve the authenticated user's profile.
- [x] **PROFILE-02:** Update permitted profile information.
- [x] **PROFILE-03:** Upload or update a profile photo.
- [x] **PROFILE-04:** Change the account password.
- [x] **PROFILE-05:** Validate profile updates and reject unauthorized modifications.

### Module 6: User Interface and Experience

- [x] **UI-01:** Provide a responsive interface for mobile, tablet, and desktop screens.
- [x] **UI-02:** Maintain a consistent design system and user-friendly navigation.
- [x] **UI-03:** Use the Poppins font consistently.
- [x] **UI-04:** Support light and dark themes where implemented.
- [x] **UI-05:** Display appropriate loading states, skeletons, or spinners.
- [x] **UI-06:** Display success and error notifications.
- [x] **UI-07:** Validate forms and provide understandable feedback.
- [x] **UI-08:** Handle API errors and empty states consistently.
- [x] **UI-09:** Ensure navigation and primary interactions work on mobile devices.
- [x] **UI-10:** Keep layout, typography, spacing, and component styling consistent across pages.

## 3. Non-Functional Requirements

### Security

- Authentication and authorization must be enforced on protected API endpoints.
- Users must only access and modify their own private learning data.
- Passwords must be hashed before storage.
- Request data must be validated on the server.
- Verification and password-reset workflows must validate tokens securely.
- Secrets and credentials must be stored in environment variables and excluded from version control.
- Authentication cookies, if used, must have appropriate security attributes for the deployment environment.
- Sensitive error details must not be exposed to clients.

### Performance and Reliability

- API responses should use a consistent structure and appropriate HTTP status codes.
- Database queries and aggregation pipelines should operate on the relevant user's data.
- Long-running or failed operations should produce appropriate error responses.
- The application should handle loading, empty, and failure states gracefully.

### Maintainability

- Frontend and backend responsibilities should remain separated.
- Routes, controllers, services, models, and validation logic should be organized into maintainable modules.
- Shared error-handling conventions should be followed.
- Environment-specific configuration should be kept outside application source code where appropriate.

### Usability and Accessibility

- The interface should remain usable across supported screen sizes.
- Forms should communicate validation errors clearly.
- Interactive elements should have understandable labels and visible feedback.
- Color, typography, and component styling should remain consistent.

## 4. Acceptance Criteria

A requirement can be marked complete only after the corresponding behavior has been implemented and verified.

### Authentication

- Valid users can register and log in.
- Invalid credentials are rejected.
- Email verification and password-reset workflows handle valid and invalid tokens appropriately.
- Protected endpoints reject unauthenticated requests.
- Logout behavior matches the implemented session and token strategy.

### Learning Journal

- Authenticated users can create, retrieve, update, and delete their own entries.
- Invalid entry data is rejected with appropriate validation feedback.
- A user cannot read, modify, or delete another user's private entry.

### Dashboard and Analytics

- Dashboard metrics are derived from the relevant user's actual database records.
- Study duration and session averages use consistent units and calculations.
- Unique-topic counts handle case and surrounding whitespace consistently where specified.
- Weekly summaries use a clearly defined date range.

### Search and Filtering

- Search and filter parameters produce the expected results.
- Supported parameters can be combined without one unintentionally overriding another.
- Invalid query parameters are handled consistently.
- Results remain restricted to the authenticated user's data.

### Profile Management

- Users can retrieve and update their permitted profile fields.
- Password changes validate the required credentials and password rules.
- Profile-photo uploads handle upload failures and invalid inputs appropriately.

### User Interface

- Primary workflows are reviewed at mobile, tablet, and desktop sizes.
- Loading, empty, success, and error states are handled appropriately.
- Light and dark themes, where available, remain visually consistent.
- Forms and navigation behave correctly in the supported browsers.

### Testing

- Automated tests cover important success and failure scenarios.
- Authentication, authorization, validation, and data ownership receive particular attention.
- Manual API checks are performed where useful.
- Passing tests and verified manual checks are documented separately.

## 5. Requirement Tracking

The checkboxes in this document are a verification checklist, not a claim that all features are incomplete or complete.

Before changing a checkbox to `[x]`:

1. Confirm that the feature exists in the current implementation.
2. Verify its expected behavior.
3. Check relevant failure and authorization cases.
4. Record any known limitations.

Implementation status should be maintained alongside the implementation roadmap and testing results.

## 6. Current Project Status

Skillora has progressed beyond the initial planning phase. Authentication and email verification, learning-entry APIs, dashboard analytics, profile APIs, and automated backend tests have been developed and tested to varying degrees.

Email delivery uses the Resend API. The backend test suite has previously passed **83 tests across 7 test suites**.

These results represent the state reported during the latest documented verification and should be rechecked after significant code changes. They do not automatically establish that every functional requirement in this document is complete.

Frontend features and production deployment behavior should be verified independently before being marked complete.
