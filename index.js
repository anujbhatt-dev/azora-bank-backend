// server.js
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const accountRoutes = require('./routes/accountRoutes');
const userRoutes = require('./routes/userRoutes'); // Assuming you have user routes as well
const cookieParser = require('cookie-parser');
const cors = require('cors')

// Other middleware and routes



// Load environment variables
dotenv.config();

// Connect to the database
connectDB();


// Use cookie-parser middleware
app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all routes
app.use(cors( 
    {
    origin: 'https://adorable-dieffenbachia-54b416.netlify.app', // Allow only this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    }
));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/account', accountRoutes);  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
