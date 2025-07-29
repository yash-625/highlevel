---
type: always
description: Comprehensive error handling patterns and debugging guidelines
---

# Error Handling Standards

## Error Resolution Process (Mandatory)
When encountering or fixing errors:

1. **Root Cause Analysis**
   - Explain why the error occurred (technical reasons)
   - Identify contributing factors (code patterns, config issues)
   - Determine if it's systemic or isolated

2. **Solution Implementation**
   - Provide the fix with clear explanation  
   - Suggest preventive measures
   - Recommend monitoring/logging improvements

## Error Handling Patterns
```javascript
// AsyncHandler Utility (Required)
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global Error Middleware (Required)
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || 'Server Error'
    }
  });
};