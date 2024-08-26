// models/Account.js
const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index to improve query performance on user field

  },
  accountNumber: {
    type: String,
    unique: true,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Balance cannot be negative',
    },
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model('Account', AccountSchema);
