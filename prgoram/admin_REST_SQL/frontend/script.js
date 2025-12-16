const API = "http://localhost:3000/api/users";

document.getElementById("userForm").addEventListener("submit", async e => {
  e.preventDefault();

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      email: email.value
    })
  });

  e.target.reset();
  loadUsers();
});

async function loadUsers() {
  const res = await fetch(API);
  const users = await res.json();

  document.getElementById("users").innerHTML = users.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>
        <button onclick="deleteUser(${u.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

async function deleteUser(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadUsers();
}

loadUsers();
