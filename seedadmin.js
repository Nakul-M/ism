require('dotenv').config();
const mongoose = require('mongoose');

const Admin = require('./models/admin'); // adjust path as needed

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));



const seedAdmin = async () => {
  const newAdmin = new Admin({ username: "1" });
  await Admin.register(newAdmin, "1"); // This hashes the password
  console.log("Admin user created with username '1' and password '1'");
  mongoose.connection.close();
};

seedAdmin();
