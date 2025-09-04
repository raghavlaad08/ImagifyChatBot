import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Fetch the user
      const user = await User.findById(userId).select('-password'); // Exclude password from the user object

      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      // Attach the user object to the request
      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message); // Log the specific error
      res.status(401).json({ success: false, message: 'Not authorized, token failed: ' + error.message });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};