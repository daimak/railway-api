// Инициализация градиентного фона с Granim.js
const granimInstance = new Granim({
  element: '#granim-canvas',
  name: 'background-gradient',
  direction: 'diagonal',
  isPausedWhenNotInView: true,
  states : {
    "default-state": {
      gradients: [
        ['#ff9a9e', '#fad0c4'],
        ['#a18cd1', '#fbc2eb'],
        ['#ffecd2', '#fcb69f']
      ],
      transitionSpeed: 5000
    }
  }
});

// Работа с пользователями
const usersList = document.getElementById('usersList');
const form = document.getElementById('add-user-form');
const nameInput = document.getElementById('user-name');

// Рендер одного пользователя
function renderUser(user) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${user.name}</span>
    <button onclick="deleteUser(${user.id}, this)">Удалить</button>
  `;
  li.style.opacity = 0;
  usersList.appendChild(li);

  // Плавное появление
  setTimeout(() => {
    li.style.opacity = 1;
  }, 50);
}

// Загрузка всех пользователей при старте
function loadUsers() {
  fetch('/users')
    .then(res => res.json())
    .then(data => {
      usersList.innerHTML = '';
      data.users.forEach(renderUser);
    });
}

// Добавление нового пользователя
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;

  fetch('/users', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name})
  })
    .then(res => res.json())
    .then(data => {
      renderUser(data.user);
      nameInput.value = '';
    });
});

// Удаление пользователя
function deleteUser(id, button) {
  fetch(`/users/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => {
      const li = button.parentElement;
      li.style.opacity = 0;
      li.style.transform = 'translateX(50px)';
      setTimeout(() => li.remove(), 500);
    });
}

// Загружаем пользователей при старте
loadUsers();