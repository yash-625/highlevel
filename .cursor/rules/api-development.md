---
type: autoAttached
globs: ["routes/**/*", "controllers/**/*", "**/*route*", "**/*controller*"]
description: API development patterns and RESTful design standards
---

# API Development Standards

## Development Workflow (Mandatory Sequence)
1. **Data Modeling First** - Design schemas before APIs
2. **API Structure Design** - Define request/response formats
3. **Implementation Logic** - Build controllers and services  
4. **Validation & Security** - Add input validation and auth

## RESTful API Standards
- Use proper HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Follow REST naming conventions for endpoints
- Implement consistent response formats
- Use appropriate HTTP status codes
- Include pagination for list endpoints
- Add filtering and sorting capabilities

## Request/Response Format
```javascript
// Standard Success Response
{
  "success": true,
  "data": {}, // or []
  "message": "Operation completed successfully",
  "pagination": { // for list endpoints
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}

// Standard Error Response
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {} // optional
  }
}