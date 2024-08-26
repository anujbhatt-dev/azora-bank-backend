const { z } = require('zod');
const validatePassword = z.string()
  .min(6, 'Password must be at least 6 characters long')
  .max(20, 'Password must be at most 20 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[@$!%*?&]/, 'Password must contain at least one special character');

module.exports = {
  validatePassword,
};
