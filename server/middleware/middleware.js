const jwt = require('jsonwebtoken');
const { secretKey } = require('./auth');
const { protect } = require('./middleware');
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ message: 'Access Denied' });
  }

  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({ message: 'Invalid Token' });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ message: 'Access Forbidden' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
