# Node.js Authentication API with TypeScript

A production-ready Node.js authentication API built with TypeScript, Express, MongoDB, and JWT authentication.

## Features

- ✅ User registration and login
- ✅ JWT authentication with secure tokens
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting for API protection
- ✅ CORS enabled
- ✅ Security headers with Helmet
- ✅ MongoDB with Mongoose ODM
- ✅ TypeScript for type safety
- ✅ Docker containerization
- ✅ Error handling and logging
- ✅ ESLint and Jest setup

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Containerization**: Docker & Docker Compose

## Project Structure

```
/project-root
├── src/
│   ├── controllers/     # Business logic for each route
│   ├── services/        # MongoDB queries and data access logic
│   ├── models/          # Mongoose schemas and data validation
│   ├── routes/          # API route definitions
│   ├── middlewares/     # Auth, validation, and other middleware functions
│   ├── validators/      # Request validation schemas
│   ├── utils/           # Shared utility functions
│   ├── types/           # TypeScript type definitions
│   ├── config/          # Environment and app configuration
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── docker/              # Docker-related files
├── dist/                # Compiled TypeScript output
└── docs/                # API documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized setup)
- MongoDB (if running locally without Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nodejs-auth-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/auth_db
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-minimum-32-characters
   JWT_EXPIRE=24h
   ```

### Running the Application

#### Option 1: Docker (Recommended)

```bash
# Build and start containers
npm run docker:up

# View logs
docker-compose logs -f

# Stop containers
npm run docker:down
```

#### Option 2: Local Development

```bash
# Make sure MongoDB is running locally
# Build TypeScript
npm run build

# Start development server
npm run dev

# Or start production server
npm start
```

### API Endpoints

#### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get user profile | Private |

#### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |

### API Usage Examples

#### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "name": "John Doe",
    "password": "Password123"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "Password123"
  }'
```

#### Get Profile (Protected)
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Development

#### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run test         # Run tests with Jest
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

#### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting (integrate with ESLint)
- **Jest**: Unit and integration testing

### Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds = 12
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive request validation
- **MongoDB Injection Protection**: Query sanitization
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configurable cross-origin resource sharing

### Database Schema

#### User Model
```typescript
{
  username: string (unique, required, 3-30 chars)
  email: string (unique, required, valid email)
  name: string (required, 2-50 chars)
  password: string (hashed, required, min 6 chars)
  createdAt: Date
  updatedAt: Date
}
```

### Docker Configuration

The application runs in two containers:
- **MongoDB**: Database with initialization script
- **API Server**: Node.js application

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/auth_db` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `24h` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Production Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Use Docker for containerized deployment
4. Set up reverse proxy (nginx) for SSL termination
5. Configure monitoring and logging
6. Set up CI/CD pipeline

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### License

This project is licensed under the MIT License.