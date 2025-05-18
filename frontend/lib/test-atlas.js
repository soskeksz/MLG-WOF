// Create this file as: test-atlas.js
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testAtlasConnection() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log('Connection string:', process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB Atlas connected successfully!');
    console.log('Connected to database:', mongoose.connection.db.databaseName);
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({
      test: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    const testDoc = await TestModel.create({ test: 'Hello Atlas!' });
    console.log('✅ Test document created:', testDoc);
    
    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document deleted');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('🔐 Connection closed');
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error);
    if (error.message.includes('authentication')) {
      console.log('💡 Check your username and password in the connection string');
    }
    if (error.message.includes('IP')) {
      console.log('💡 Make sure your IP address is whitelisted in Atlas');
    }
  }
}

testAtlasConnection();