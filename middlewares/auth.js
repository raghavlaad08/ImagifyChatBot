import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    console.log('=== MIDDLEWARE DEBUG ===');
    console.log('All headers:', req.headers);
    console.log('Authorization header:', req.headers.authorization);
    console.log('Token header:', req.headers.token);
    
    let token;

    // Check for 'Authorization' header (standard practice)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.slice(7); // Extract token after 'Bearer '
        console.log('Token extracted from Authorization header:', token);
    }
    // Fallback: check for custom 'token' header
    else if (req.headers.token && req.headers.token.startsWith('Bearer ')) {
        token = req.headers.token.slice(7);
        console.log('Token extracted from token header:', token);
    }

    console.log('Final token:', token);
    console.log('========================');

    // If no token was found, respond with an error
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided'
        });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        // Find the user by the ID in the decoded token payload
        const user = await User.findById(decoded.id).select('-password');

        // If user not found, they are not authorized
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, user not found'
            });
        }

        // Attach the user object to the request for subsequent middleware/route handlers
        req.user = user;
        console.log('User attached to request:', user._id);
        return next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        // Handle specific JWT errors for better client feedback
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token has expired'
            });
        }
        // General token verification failure
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed: ' + error.message
        });
    }
};