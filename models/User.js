// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true // Add index to improve query performance on email field
  },
  password: {
    type: String,
    required: true,
  },
},{
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  user.password = await bcrypt.hash(user.password, 10);
  next();
});


// Compare the entered password with the hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  const user = this
  return await bcrypt.compare(enteredPassword, user.password);
};

module.exports = mongoose.model('User', UserSchema);
