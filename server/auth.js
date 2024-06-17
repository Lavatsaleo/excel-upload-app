const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = 'yourSecretKey';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = { generateToken, hashPassword, comparePassword, secretKey };
