import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized — no token provided' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token signature + expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Hydrate user (exclude password)
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Not authorized — user no longer exists' });
    }

    // 4. Attach user to request for downstream handlers
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ error: 'Not authorized — token invalid or expired' });
  }
};

export default protect;
