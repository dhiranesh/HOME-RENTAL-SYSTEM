const mongoose = require('mongoose');

// MongoDB Atlas connection string
const mongoURI = "mongodb+srv://dhira:dhira123@cluster0.c9gs2r6.mongodb.net/home-rental?retryWrites=true&w=majority";

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(mongoURI);
    console.log('Connection successful!');
    
    // Create a simple test model and document
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      name: String,
      date: { type: Date, default: Date.now }
    }));
    
    // Create a test document
    await TestModel.create({ name: 'Test Connection' });
    console.log('Test document created successfully');
    
    // Retrieve the test document
    const testDocs = await TestModel.find({});
    console.log('Documents in test collection:', testDocs);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

// Run the test
testConnection();
