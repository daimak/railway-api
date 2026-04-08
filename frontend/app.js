const userList = document.getElementById('user-list');
const form = document.getElementById('add-user-form');
const nameInput = document.getElementById('user-name');

// Рендер одного пользователя
function renderUser(user) {
  const card = document.createElement('div');
  card.className = 'user-card';
  card.innerHTML = `
    <span>${user.name}</span>
    <button onclick="deleteUser(${user.id}, this)">Удалить</button>
  `;
  card.style.opacity = 0;
  userList.appendChild(card);

  setTimeout(() => {
    card.style.opacity = 1;
  }, 50);
}

// Загрузка всех пользователей с сервера при старте
function loadUsers() {
  fetch('/users')
    .then(res => res.json())
    .then(data => {
      userList.innerHTML = '';
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
      const card = button.parentElement;
      card.style.opacity = 0;
      card.style.transform = 'translateX(50px)';
      setTimeout(() => card.remove(), 500);
    });
}

// Загружаем пользователей при старте
loadUsers();