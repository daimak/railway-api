// --- Плавный градиент ---
var granimInstance = new Granim({
    element: '#granim-canvas',
    direction: 'diagonal',
    isPausedWhenNotInView: true,
    states : {
        "default-state": {
            gradients: [
                ['#FF5F6D', '#FFC371'],
                ['#2193b0', '#6dd5ed'],
                ['#cc2b5e', '#753a88']
            ]
        }
    }
});

// --- Работа с API ---
const API_URL = 'https://railway-api-production-6083.up.railway.app/users';

const addBtn = document.getElementById('addBtn');
addBtn.onclick = addUser;

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

    // плавное появление
    setTimeout(() => li.style.opacity = 1, 50);
  });
}

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

async function deleteUser(id, li) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadUsers();
}

// загрузка пользователей при старте
loadUsers();