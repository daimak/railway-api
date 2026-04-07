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

// Update
app.put('/users/:name', (req, res) => {
    const oldName = req.params.name;
    const newName = req.body.name;

    if (!newName) {
        return res.status(400).json({ error: "Новое имя не указано" });
    }

    const index = users.indexOf(oldName);
    if (index === -1) {
        return res.status(404).json({ error: "Пользователь не найден" });
    }

    users[index] = newName;

    res.json({
        message: `Имя пользователя '${oldName}' изменено на '${newName}'`,
        users
    });
});

// Delete
app.delete('/users/:name', (req, res) => {
    const name = req.params.name;
    const index = users.indexOf(name);

    if (index === -1) {
        return res.status(404).json({ error: "Пользователь не найден" });
    }

    users.splice(index, 1);

    res.json({
        message: `Пользователь '${name}' удалён`,
        users
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});