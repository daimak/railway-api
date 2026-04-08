const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();          // <-- сначала создаём app
app.use(express.json());        // <-- потом middleware
app.use(express.static(path.join(__dirname, '../frontend'))); // <-- потом статика

// --- подключение к PostgreSQL ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// --- API ---
app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users ORDER BY id');
  res.json({ users: result.rows });
});

// остальные маршруты POST, PUT, DELETE ...

// --- запуск сервера ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));