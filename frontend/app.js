const API_URL = '/users';

const addBtn = document.getElementById('addBtn');
addBtn.onclick = addUser;

// загружаем пользователей
async function loadUsers() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const list = document.getElementById('usersList');
  list.innerHTML = '';

  data.users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = user.name;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить';
    delBtn.className = 'delete-btn';
    delBtn.onclick = () => deleteUser(user.id, li);

    li.appendChild(delBtn);
    list.appendChild(li);

    setTimeout(() => li.classList.add('show'), 50);
  });
}

// добавить пользователя
async function addUser() {
  const input = document.getElementById('nameInput');
  const name = input.value.trim();
  if (!name) return alert('Введите имя');

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });

  input.value = '';
  loadUsers();
}

// удалить пользователя
async function deleteUser(id, li) {
  li.classList.remove('show');
  li.style.opacity = 0;
  li.style.transform = 'translateY(-10px)';
  await new Promise(r => setTimeout(r, 300));

  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadUsers();
}

// старт
loadUsers();

// --- Granim ---
new Granim({
  element: '#granim-canvas',
  direction: 'diagonal',
  isPausedWhenNotInView: true,
  states : {
    "default-state": {
      gradients: [
        ['#ff9a9e', '#fad0c4'],
        ['#a1c4fd', '#c2e9fb'],
        ['#667eea', '#764ba2']
      ],
      transitionSpeed: 4000
    }
  }
});