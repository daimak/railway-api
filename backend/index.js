const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express(); // создаём сервер
app.use(express.json()); // чтобы обрабатывать JSON в теле запроса

// --- раздаём фронтенд (HTML/CSS/JS) ---
app.use(express.static(path.join(__dirname, '../frontend')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/app.html'));
});

// --- подключение к PostgreSQL ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/railway",
  ssl: { rejectUnauthorized: false }
});

// --- API ---
// Получить всех пользователей
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Добавить пользователя
app.post('/users', async (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(400).json({ error: "Имя не указано" });

  try {
    const result = await pool.query(
      'INSERT INTO users(name) VALUES($1) RETURNING *',
      [name]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Обновить пользователя по ID
app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const newName = req.body.name;
  if (!newName) return res.status(400).json({ error: "Новое имя не указано" });

  try {
    const result = await pool.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
      [newName, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Пользователь не найден" });

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Удалить пользователя по ID
app.delete('/users/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Пользователь не найден" });

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// --- Запуск сервера ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));