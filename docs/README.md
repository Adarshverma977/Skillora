# Skillora — Student Learning Journal

Skillora is a full-stack MERN application designed to help students document their daily learning activities, track study hours, review learning progress, and build consistent study habits.

## Project Overview

Skillora provides students with a personal learning journal where they can organize topics, record study sessions, monitor productivity, and manage their profiles through a clean, responsive interface.

## Features

### Authentication
- Student registration and login
- Logout functionality
- Email verification
- Forgot-password functionality
- JWT-based authentication
- Protected routes and API endpoints

### Learning Journal
- Create daily learning entries
- Record topic names and learning descriptions
- Track study duration
- Set difficulty levels
- View, edit, and delete entries
- View individual entry details

### Dashboard
- Total learning entries
- Aggregate study hours
- Weekly learning summary
- Recently added topics
- Productivity overview

### Search and Filters
- Search by topic name
- Filter entries by date
- Filter entries by difficulty level

### Profile Management
- View personal information
- Update student profile
- Upload profile photo
- Change password

### User Experience
- Responsive, mobile-first design
- Modern interface using the Poppins font
- Loading indicators and skeleton screens
- Toast notifications
- Form validation
- Consistent error handling

## Technology Stack

### Frontend
- React
- JavaScript
- CSS
- Additional libraries to be finalized during implementation

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)

### Development Tools
- Git and GitHub
- Postman
- Visual Studio Code

## Project Structure

```text
Skillora/
├── client/       # React frontend
├── server/       # Node.js and Express backend
├── docs/         # Project documentation
├── .gitignore
└── README.md
```

## Getting Started

Setup instructions, environment variables, installation commands, and execution steps will be added after the frontend and backend configurations are established.

## Security

- Protect private routes and API endpoints.
- Restrict journal access to the authenticated owner.
- Store passwords securely using an appropriate password-hashing algorithm.
- Keep secrets and environment variables out of version control.
- Validate and handle incoming requests safely.

## Development Status

**Current Phase:** Initial setup and documentation.

Features listed in this README represent the project scope and are not claims of completed implementation.

## License

The project license will be decided before public release.