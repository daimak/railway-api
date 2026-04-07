const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// 👇 массив для хранения пользователей
const users = [];

app.get('/', (req, res) => {
  res.send('Hello, Railway!');
});

app.get('/api', (req, res) => {
  res.json({ message: "API работает 🚀" });
});

app.get('/hello/:name', (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});



app.post('/data', (req, res) => {
  const name = req.body.name;

  if(!name) {
    return res.status(400).json({ error: "Имя не указано" });
  }

  users.push(name); // сохраняем в память

  res.json({
    message: `Привет, ${name}! Пользователь сохранён.`,
    totalUsers: users.length // показываем, сколько всего пользователей
  });
});

app.get('/users', (req, res) => {
  res.json({
    users: users,
    total: users.length
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});