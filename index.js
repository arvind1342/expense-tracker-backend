const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(cors(
  {
    origin: ["http://localhost:3000"], // ✅ allow your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }
));
app.use(bodyParser.json());

// ✅ Add this root route
app.get('/', (req, res) => {
  res.send('✅ Expense Tracker Backend is Live!');
});

// MySQL connection
const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect(err => {
  if (err) {
    console.error("❌ Database connection failed:", err.stack);
    return;
  }
  console.log("✅ Connected to database!");
});

// Get all expenses
app.get('/expenses', (req, res) => {
  db.query('SELECT * FROM expenses ORDER BY date DESC', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add expense
app.post('/expenses', (req, res) => {
  const { title, amount, date, category } = req.body;
  db.query(
    'INSERT INTO expenses (title, amount, date, category) VALUES (?, ?, ?, ?)',
    [title, amount, date, category],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Expense added', id: result.insertId });
    }
  );
});

// Delete expense
app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM expenses WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Expense deleted' });
  });
});

// Start server
const PORT = process.env.PORT || 3001; // ✅ Use dynamic port for Render
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

