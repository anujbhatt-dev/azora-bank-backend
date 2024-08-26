// controllers/accountController.js
const Account = require('../models/Account');
const User = require('../models/User');



// Update account (e.g., deposit, withdraw)
exports.updateAccount = async (req, res) => {
    const { amount } = req.body;
  
    try {
      // Use the account from req.account attached by the middleware
      const account = req.account;
  
      if (!account) {
        return res.status(404).json({ success: false, message: 'Account not found' });
      }
  
      // Update the balance (for simplicity, amount is handled frontend so that it will never be negative)
      account.balance = amount;
      await account.save();
  
      res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error: '+ err.message });
    }
  }; 
    