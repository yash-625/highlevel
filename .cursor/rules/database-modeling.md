---
type: autoAttached
globs: ["models/**/*", "**/*model*", "**/*schema*"]
description: MongoDB data modeling and Mongoose schema guidelines
---

# Database Modeling Standards

## Schema Design Process
1. **Always start with data modeling before API design**
2. **Follow MongoDB data modeling guidelines**: https://www.mongodb.com/docs/manual/data-modeling/
3. **Consider query patterns first, then design schemas**
4. **Plan for indexing and performance from the start**

## Mongoose Schema Requirements
- Use strict schema validation
- Define proper data types and constraints
- Add custom validation where needed
- Include timestamps: `{ timestamps: true }`
- Use virtual fields for computed properties
- Define proper indexes for query optimization

## Example Schema Pattern
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  // Add proper validation and constraints
}, { 
  timestamps: true,
  versionKey: false
});

// Add indexes
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);