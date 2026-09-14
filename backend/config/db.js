const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'MONGO_STRING_URI',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
