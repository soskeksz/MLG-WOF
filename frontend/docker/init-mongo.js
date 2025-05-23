// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time
// It creates a database and user for our application

// Switch to the wheel_of_fortune database
// If it doesn't exist, MongoDB will create it
db = db.getSiblingDB('wheel_of_fortune');

// Create a user specifically for our application
// This user will have read/write permissions on our database
db.createUser({
  // Username for our application to connect with
  user: 'wheeluser',
  // Password for our application user
  pwd: 'wheelpass',
  // Roles define what this user can do
  roles: [
    {
      // readWrite role allows reading and writing to the database
      role: 'readWrite',
      // Apply this role to our specific database
      db: 'wheel_of_fortune'
    }
  ]
});

// Create an initial collection to ensure the database exists
// MongoDB only creates a database when it has at least one collection
db.createCollection('users');

// Insert a test user to verify everything works
// This user will appear in your leaderboard when you first run the app
db.users.insertOne({
  username: 'MLGTestUser',
  money: 5000,
  gamesPlayed: 10,
  lastPlayed: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
});

// Print success message (will appear in Docker logs)
print('Database initialization completed successfully!');
print('Created user: wheeluser');
print('Created database: wheel_of_fortune');
print('Inserted test user: MLGTestUser');