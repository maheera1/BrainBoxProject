const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateUser = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Access Denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token to req.user
    
    next();
  } catch (err) {
    res.status(400).send({ message: 'Invalid Token' });
  }
};



// Middleware for role-based access control
const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ message: 'Access Denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
