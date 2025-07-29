// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the auth_db database
db = db.getSiblingDB('auth_db');

// Create application user with read/write permissions
db.createUser({
  user: 'appuser',
  pwd: 'apppass',
  roles: [
    {
      role: 'readWrite',
      db: 'auth_db'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });

console.log('MongoDB initialization completed successfully!');