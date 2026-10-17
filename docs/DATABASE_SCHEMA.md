# Skillora — Database Schema Design

## 1. Overview

Skillora will use MongoDB with Mongoose to store student accounts and learning journal entries.

The initial database design contains two primary collections:

1. `users`
2. `learningentries`

Each learning entry belongs to one user. A user can have multiple learning entries.

## 2. Users Collection

**Collection:** `users`

Stores account details, profile information, and authentication-related data.

| Field | Data Type | Purpose |
|---|---|---|
| `_id` | ObjectId | Unique user identifier |
| `name` | String | Student's display name |
| `email` | String | Login email; normalized and unique |
| `password` | String | Hashed password, never plaintext |
| `isEmailVerified` | Boolean | Email verification status |
| `profilePhoto` | String | Profile-photo URL or storage reference |
| `createdAt` | Date | Account creation timestamp |
| `updatedAt` | Date | Last update timestamp |

### User Validation Rules

- `name` is required and must satisfy the defined length limits.
- `email` is required, normalized consistently, and unique.
- `password` must meet the application's password policy before hashing.
- The database stores only the password hash, never the original password.
- `isEmailVerified` defaults to `false`.
- Profile-photo storage references must be validated before use.
- Timestamps are maintained automatically by Mongoose.

### Security Note

Email-verification tokens, password-reset tokens, and session-related data must be handled securely. Their final storage design will be specified in the authentication documentation.

## 3. Learning Entries Collection

**Collection:** `learningentries`

Stores a student's individual learning journal entries.

| Field | Data Type | Purpose |
|---|---|---|
| `_id` | ObjectId | Unique entry identifier |
| `user` | ObjectId | Reference to the owning user |
| `topic` | String | Learning topic name |
| `description` | String | Description of what was learned |
| `studyDurationMinutes` | Number | Study duration in minutes |
| `difficulty` | String | Difficulty classification |
| `learningDate` | Date | Date associated with the learning activity |
| `createdAt` | Date | Entry creation timestamp |
| `updatedAt` | Date | Last update timestamp |

### Learning Entry Validation Rules

- `user` is required and references a valid user document.
- `topic` is required and must satisfy the defined length limits.
- `description` is required and must satisfy the defined length limits.
- `studyDurationMinutes` must be a positive, valid number within the application's configured limit.
- `difficulty` must be one of the allowed values: `Easy`, `Medium`, or `Hard`.
- `learningDate` is required and must be a valid date.
- Creation and update timestamps are maintained automatically.

## 4. Relationships

The relationship between users and learning entries is **one-to-many**.

```text
User
 │
 ├── Learning Entry 1
 ├── Learning Entry 2
 ├── Learning Entry 3
 └── Learning Entry N
```

Each learning entry stores the owning user's ObjectId in its `user` field.

The backend must verify ownership when reading, updating, or deleting entries. A client-provided user ID must never be trusted as proof of ownership.

## 5. Indexing Strategy

The following indexes are planned for common queries:

### Users

- Unique index on normalized `email`.

### Learning Entries

- Compound index on `{ user: 1, learningDate: -1 }` for user-specific date queries.
- Compound index on `{ user: 1, difficulty: 1, learningDate: -1 }` for difficulty filtering.
- Additional topic-search indexes will be evaluated after choosing the search strategy.

Indexes must be verified against actual query patterns before production deployment.

## 6. Dashboard Calculations

Dashboard metrics will be derived from the authenticated user's learning entries.

### Total Entries

Count all entries belonging to the user.

### Total Study Hours

Sum `studyDurationMinutes` across the user's entries and convert the total into hours for display.

### Weekly Summary

Aggregate entries within clearly defined weekly date boundaries.

### Recently Added Topics

Retrieve the user's latest entries in descending creation order.

### Productivity Overview

Use clearly defined metrics based on actual journal activity. The exact productivity calculation will be finalized before implementation.

## 7. Data Integrity and Ownership

- Validate input in the API before database writes.
- Enforce required fields and allowed values in Mongoose schemas.
- Scope all private entry queries to the authenticated user.
- Handle missing or invalid ObjectIds appropriately.
- Prevent duplicate account emails.
- Avoid exposing password hashes and internal authentication fields in API responses.
- Define appropriate cleanup behavior when a user account is deleted.

## 8. Future Considerations

The initial schema may evolve if requirements introduce additional features such as tags, learning streaks, goals, reminders, or analytics.

Any schema change must be documented and tested before release.

## 9. Schema Status

**Status:** Initial database design documented.

Mongoose schemas, validators, and indexes have not yet been implemented or tested.