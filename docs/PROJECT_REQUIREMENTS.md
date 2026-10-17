# Skillora — Project Requirements

## 1. Project Overview

**Project Name:** Skillora  
**Project Type:** Full-Stack MERN Application  
**Product Category:** Student Learning Journal  
**Primary Goal:** Help students record daily learning activities and track their learning progress.

## 2. Functional Requirements

### Module 1: Authentication

- [ ] AUTH-01: Student registration
- [ ] AUTH-02: Student login
- [ ] AUTH-03: Student logout
- [ ] AUTH-04: Email verification after registration
- [ ] AUTH-05: Forgot password
- [ ] AUTH-06: JWT authentication
- [ ] AUTH-07: Protected-route middleware

### Module 2: Learning Journal

- [ ] JOURNAL-01: Add a daily learning entry
- [ ] JOURNAL-02: Enter the topic name
- [ ] JOURNAL-03: Enter a learning description
- [ ] JOURNAL-04: Record study duration
- [ ] JOURNAL-05: Select a difficulty level
- [ ] JOURNAL-06: Edit an existing entry
- [ ] JOURNAL-07: Delete an entry
- [ ] JOURNAL-08: View all learning entries
- [ ] JOURNAL-09: View a single-entry detail

### Module 3: Dashboard

- [ ] DASH-01: Display total entries count
- [ ] DASH-02: Calculate total study hours
- [ ] DASH-03: Display a weekly learning summary
- [ ] DASH-04: Display recently added topics
- [ ] DASH-05: Display a productivity overview

### Module 4: Search and Filters

- [ ] SEARCH-01: Search entries by topic name
- [ ] SEARCH-02: Filter entries by date
- [ ] SEARCH-03: Filter entries by difficulty

### Module 5: Profile Management

- [ ] PROFILE-01: Update student profile
- [ ] PROFILE-02: Upload a profile photo
- [ ] PROFILE-03: View personal information
- [ ] PROFILE-04: Change password

### Module 6: User Interface and Experience

- [ ] UI-01: Responsive, mobile-first design
- [ ] UI-02: Clean, modern, user-friendly interface
- [ ] UI-03: Loading states, skeletons, or spinners
- [ ] UI-04: Toast notifications
- [ ] UI-05: Proper form validation
- [ ] UI-06: Proper error handling

## 3. Non-Functional Requirements

- The application should be responsive across mobile, tablet, and desktop screens.
- User-specific journal data must be protected from unauthorized access.
- Authentication and password-handling flows must follow secure practices.
- API responses and error messages should follow a consistent structure.
- Forms should provide clear validation feedback.
- The interface should use the **Poppins** font consistently.
- The codebase should be modular and maintainable.

## 4. Acceptance Criteria

- Each functional requirement must be implemented and tested before being marked complete.
- Users must only be able to access their own protected journal data.
- Dashboard metrics must be calculated from the user's actual entries.
- Search and filters must work together correctly where applicable.
- Forms must handle invalid input and API errors appropriately.
- The UI must be visually reviewed at mobile, tablet, and desktop sizes.

## 5. Requirement Tracking

The checkboxes above represent the initial implementation checklist. Mark a requirement complete only after implementation and verification.

**Current Status:** Requirements documented; implementation not yet started.