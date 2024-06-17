const express = require('express');
const db = require('./db');
const { hashPassword, comparePassword, generateToken } = require('./auth');
const { authenticateToken, authorizeRole } = require('./middleware');
const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await hashPassword(password);

    const [result] = await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error registering user' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(400).send({ message: 'Invalid username or password' });
    }

    const user = rows[0];
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: 'Invalid username or password' });
    }

    const token = generateToken(user);
    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error logging in' });
  }
});

// Protected route for uploading files
router.post('/upload', authenticateToken, authorizeRole(['uploader']), async (req, res) => {
  // File upload logic here
});

// Protected route for downloading files
router.get('/download/:id', authenticateToken, authorizeRole(['downloader']), async (req, res) => {
  // File download logic here
});

module.exports = router;
