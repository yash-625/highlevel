---
type: agentRequested
description: Feature development workflow and change management process
---

# Feature Development Workflow

## New Feature Process (Required Sequence)

### 1. Data Modeling First
- Analyze data requirements and relationships
- Design MongoDB schemas with proper validation
- Consider indexing and query optimization  
- Plan for data migration if modifying existing schemas

### 2. API Structure Design
- Define clear request/response formats
- Establish RESTful endpoints
- Document expected status codes and error responses
- Plan pagination, filtering, and sorting strategies

### 3. Implementation Logic
- Design business logic in controllers
- Implement data access patterns in services
- Add appropriate middleware for validation, auth, etc.
- Include comprehensive error handling

### 4. Validation & Security
- Input validation with express-validator
- Authentication and authorization middleware
- Rate limiting and security headers
- Data sanitization and XSS protection

## Change Management Process (Required for Modifications)

### Impact Analysis (Before Any Changes)
1. **Review existing codebase** - Understand current implementation
2. **Identify affected components** - Models, routes, controllers, services
3. **Assess database changes** - Schema modifications, migrations needed
4. **Evaluate breaking changes** - Impact on API consumers

### Change Implementation
1. **Backward compatibility** - Suggest compatible approaches when possible
2. **Migration paths** - Clear strategy for breaking changes
3. **Performance impact** - Assess implications of modifications
4. **Testing strategy** - Plan for affected areas

## Code Review Checklist
- [ ] Data model designed before implementation
- [ ] API follows RESTful conventions
- [ ] Proper error handling implemented
- [ ] Input validation added
- [ ] Security considerations addressed
- [ ] Tests written for new functionality
- [ ] Documentation updated