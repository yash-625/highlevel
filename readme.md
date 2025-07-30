# Node.js Authentication API with TypeScript

A production-ready Node.js authentication API built with TypeScript, Express, MongoDB, and JWT authentication.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized setup)
- MongoDB (if running locally without Docker)

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

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd highlevel
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

## Running the Application

### Option 1: Docker (Recommended)

```bash
# Build and start containers
npm run docker:up

# View logs
docker-compose logs -f

# Stop containers
npm run docker:down
```

### Option 2: Local Development

```bash
# Make sure MongoDB is running locally
# Build TypeScript
npm run build

# Start development server
npm run dev

# Or start production server
npm start
```

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run test         # Run tests with Jest
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run docker:up    # Start Docker containers
npm run docker:down  # Stop Docker containers
```

## Environment Variables

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

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds = 12
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive request validation
- **MongoDB Injection Protection**: Query sanitization
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configurable cross-origin resource sharing

## Docker Configuration

The application runs in two containers:
- **MongoDB**: Database with initialization script
- **API Server**: Node.js application

## License

This project is licensed under the MIT License.