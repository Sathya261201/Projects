const API = "http://localhost:3000/api/users";

const form = document.getElementById("userForm");
const submitBtn = document.getElementById("submitBtn");
const usersTable = document.getElementById("users");

// ✅ FIX: explicit input references
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

let editUserId = null;

// LOAD USERS
async function loadUsers() {
  const res = await fetch(API);
  const users = await res.json();

  usersTable.innerHTML = users.map(user => `
    <tr>
      <td>${user._id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <button 
          class="edit-btn"
          data-id="${user._id}"
          data-name="${user.name}"
          data-email="${user.email}">
          Edit
        </button>
        <button onclick="deleteUser('${user._id}')">
          Delete
        </button>
      </td>
    </tr>
  `).join("");

  attachEditEvents();
}

// ATTACH EDIT EVENTS
function attachEditEvents() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      nameInput.value = btn.dataset.name;
      emailInput.value = btn.dataset.email;
      editUserId = btn.dataset.id;
      submitBtn.innerText = "Update User";
    });
  });
}

// CREATE / UPDATE
form.addEventListener("submit", async e => {
  e.preventDefault();

  const userData = {
    name: nameInput.value,
    email: emailInput.value
  };

  if (editUserId) {
    // UPDATE
    await fetch(`${API}/${editUserId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    editUserId = null;
    submitBtn.innerText = "Add User";
  } else {
    // CREATE
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
  }

  form.reset();
  loadUsers();
});

// DELETE
async function deleteUser(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadUsers();
}

// INITIAL LOAD
loadUsers();
