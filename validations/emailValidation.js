const z = require('zod');

// Define a Zod schema to validate email addresses
const validateEmail = z.string().email({ message: 'Invalid email format' });

module.exports = {
    validateEmail,
}; 
