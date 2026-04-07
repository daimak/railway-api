const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, Railway!');
});

app.get('/api', (req, res) => {
  res.json({ message: "API работает 🚀" });
});

app.get('/hello/:name', (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});