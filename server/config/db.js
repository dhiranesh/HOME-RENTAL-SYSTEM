const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the MONGO_URI from environment variables
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) throw new Error('MONGO_URI not set in environment variables');
    console.log('Connecting to MongoDB:', mongoURI);
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Database Name: ${conn.connection.name}`);
    
    // Count properties to verify connection
    const Property = require('../models/Property');
    const count = await Property.countDocuments();
    console.log(`Found ${count} properties in the database`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
