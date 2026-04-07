const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// 👇 подключаемся к PostgreSQL через DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // обязательно для Railway
});

// 👇 базовые маршруты
app.get('/', (req, res) => {
  res.send('Hello, Railway!');
});

app.get('/api', (req, res) => {
  res.json({ message: "API работает 🚀" });
});

app.get('/hello/:name', (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});

// 👇 POST /data — добавляем пользователя
app.post('/data', async (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(400).json({ error: "Имя не указано" });

  try {
    const result = await pool.query(
      'INSERT INTO users(name) VALUES($1) RETURNING *',
      [name]
    );
    res.json({
      message: `Привет, ${name}! Пользователь сохранён.`,
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 👇 GET /users — получаем всех пользователей
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    res.json({
      users: result.rows,
      total: result.rows.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 👇 PUT /users/:name — обновляем имя
app.put('/users/:name', async (req, res) => {
  const oldName = req.params.name;
  const newName = req.body.name;

  if (!newName) return res.status(400).json({ error: "Новое имя не указано" });

  try {
    const result = await pool.query(
      'UPDATE users SET name=$1 WHERE name=$2 RETURNING *',
      [newName, oldName]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json({
      message: `Имя пользователя '${oldName}' изменено на '${newName}'`,
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 👇 DELETE /users/:name — удаляем пользователя
app.delete('/users/:name', async (req, res) => {
  const name = req.params.name;

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE name=$1 RETURNING *',
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json({
      message: `Пользователь '${name}' удалён`,
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 👇 запускаем сервер
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});