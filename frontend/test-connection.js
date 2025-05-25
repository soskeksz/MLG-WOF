// test-connection.js - Create this file in your frontend folder
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Testing MongoDB Connection...');
  console.log('📡 Environment check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    console.log('💡 Make sure your .env.local file exists and contains MONGODB_URI');
    return;
  }
  
  // Log the connection string (hide password for security)
  const sanitizedUri = process.env.MONGODB_URI.replace(
    /\/\/([^:]+):([^@]+)@/,
    '//***:***@'
  );
  console.log('🔗 Connection string:', sanitizedUri);
  
  try {
    console.log('⏳ Attempting to connect...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database info:');
    console.log('  - Database name:', mongoose.connection.db.databaseName);
    console.log('  - Connection state:', mongoose.connection.readyState);
    console.log('  - Host:', mongoose.connection.host);
    
    // Test creating a document
    console.log('🧪 Testing document creation...');
    
    const testSchema = new mongoose.Schema({
      test: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('ConnectionTest', testSchema);
    
    // Create test document
    const testDoc = await TestModel.create({ 
      test: 'Connection test successful!' 
    });
    console.log('✅ Test document created:', testDoc._id);
    
    // Read test document
    const foundDoc = await TestModel.findById(testDoc._id);
    console.log('✅ Test document retrieved:', foundDoc.test);
    
    // Clean up test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document cleaned up');
    
    console.log('🎉 All tests passed! Your MongoDB connection is working correctly.');
    
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    // Provide specific troubleshooting based on error type
    if (error.message.includes('Invalid scheme')) {
      console.log('💡 Connection string should start with "mongodb://" or "mongodb+srv://"');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Check your username and password in the connection string');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('network')) {
      console.log('💡 Check your internet connection and MongoDB Atlas network access settings');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Connection timed out - check if your IP is whitelisted in MongoDB Atlas');
    }
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Verify your connection string format');
    console.log('2. Check MongoDB Atlas Network Access (whitelist your IP)');
    console.log('3. Verify database user credentials');
    console.log('4. Ensure your cluster is running');
  } finally {
    // Close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔐 Connection closed');
    }
  }
}

// Run the test
testConnection().catch(console.error);