// controllers/userController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Account = require('../models/Account');
const mongoose = require("mongoose")
const {validatePassword} = require("../validations/passwordValidation")
const {validateEmail} = require("../validations/emailValidation")
const z = require('zod');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// User Signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate input using Zod
    validateEmail.parse(email);  // This will throw if the email is invalid
    validatePassword.parse(password); // This will throw if the password is invalid

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    user = new User({
      name,
      email,
      password,
    });

    // Save the user within the transaction
    await user.save({ session });

    // Automatically create an account for the new user
    const accountNumber = `ACCT-${Date.now()}`;
    const account = new Account({
      user: user._id,
      accountNumber,
      accountType: 'savings', // Default account type
    });

    // Save the account within the transaction
    await account.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Generate a token and set cookie
    const token = generateToken(user._id);
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: 'None'
    };
    res.cookie('token', token);

    // Respond with user and account information
    res.status(201).json({ succuss:true, account, user });

  } catch (err) {
    // Abort the transaction if any error occurs
    await session.abortTransaction();
    session.endSession();

    if (err instanceof z.ZodError) {
      // Handle Zod validation errors
      return res.status(400).json({
        success: false,
        error: err.errors[0].message,  // Detailed Zod validation errors
      });
    }

    // Handle other errors
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error: '+ err.message,
    });
  }
};



// User Login
exports.login = async (req, res) => {  
  const { email, password } = req.body;
  
  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' }); // If user not found, return error
    }

    // Verify the password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' }); // If password does not match, return error
    }

    // Fetch the associated account details
    const account = await Account.findOne({ user: user._id });

    // Generate a JWT token for the user
    const token = generateToken(user._id);

    // Set cookie options
    const cookieOptions = {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
      sameSite: 'None' // Allows cross-site requests with the cookie
    };

    // Set the cookie with the generated token
    res.cookie('token', token);

    // Respond with user and account details
    res.status(200).json({ success:true, user, account });
  } catch (err) {
    console.error(err.message); // Log the error message for debugging
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message
    });
  }
};



// User Get My Info
exports.getMyInfo = (req, res) => {
  try {
    // Check if user and account are attached to req by the protect middleware
    if (!req.user || !req.account) {
      // If user or account is not found, respond with a 401 Unauthorized status
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. User or account information is missing.',
      });
    }

    // Respond with user and account information
    res.status(200).json({
      success:true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      account: req.account,
    });
  } catch (err) {
    // Log the error and respond with a generic server error message
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error: '+ err.message,
    });
  }
};


