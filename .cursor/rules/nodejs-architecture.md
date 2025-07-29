---
type: always
description: Core Node.js architecture and technology stack guidelines
---

# Node.js Architecture Standards

## Technology Stack Requirements
- Use Express.js for web framework
- MongoDB with Mongoose ODM for database operations
- JWT for authentication (avoid deprecated libraries)
- Use only actively maintained, well-supported npm packages
- Prioritize security-focused libraries (helmet, express-rate-limit, express-validator)

## Project Structure (Mandatory)
/project-root
├── controllers/     # Business logic for each route
├── services/        # MongoDB queries and data access logic
├── models/          # Mongoose schemas and data validation
├── routes/          # API route definitions
├── middlewares/     # Auth, validation, and other middleware functions
├── utils/           # Shared utility functions (DB connection, helpers)
├── config/          # Environment configs, database configs
├── tests/           # Unit and integration tests
└── docs/            # API documentation

## Code Standards
- Use ES6+ features (async/await, destructuring, arrow functions)
- Implement proper error handling with try/catch blocks
- Follow functional programming principles where possible
- Use meaningful variable and function names
- Add JSDoc comments for all public functions
- Ensure production-grade scalability considerations