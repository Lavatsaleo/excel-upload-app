const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'Leon',
  password: 'Gianna',
  database: 'exceldb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();

const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const db = require('./db');
const cors = require('cors');
const userRoutes = require('./userRoutes');
const { authenticateToken, authorizeRole } = require('./middleware');
const authRoutes = require('./routes/auth');
const sequelize = require('./config/database');
require('dotenv').config();
const { protect } = require('./middleware');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use('/api/users', userRoutes);

// Protected route for uploading files
app.post('/upload', authenticateToken, authorizeRole(['uploader']), upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Save file metadata to database
    const [result] = await db.query('INSERT INTO files (name, data) VALUES (?, ?)', [file.originalname, JSON.stringify(jsonData)]);
    res.status(200).send({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error uploading file' });
  }
});

// Protected route for downloading files
app.get('/download/:id', authenticateToken, authorizeRole(['downloader']), async (req, res) => {
  try {
    const fileId = req.params.id;
    const [rows] = await db.query('SELECT * FROM files WHERE id = ?', [fileId]);

    if (rows.length > 0) {
      const fileData = JSON.parse(rows[0].data);
      const worksheet = xlsx.utils.json_to_sheet(fileData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Disposition', `attachment; filename=${rows[0].name}`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } else {
      res.status(404).send({ message: 'File not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error downloading file' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

