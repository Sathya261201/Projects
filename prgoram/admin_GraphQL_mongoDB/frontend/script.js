const GRAPHQL_API = "http://localhost:3000/graphql";

const form = document.getElementById("userForm");
const submitBtn = document.getElementById("submitBtn");
const usersTable = document.getElementById("users");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

let editUserId = null;

/* ---------- GraphQL Helper ---------- */
async function fetchGraphQL(query, variables = {}) {
  const res = await fetch(GRAPHQL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables })
  });
  return res.json();
}

/* ---------- LOAD USERS ---------- */
async function loadUsers() {
  const query = `
    query {
      users {
        id
        name
        email
      }
    }
  `;

  const result = await fetchGraphQL(query);
  const users = result.data.users;

  usersTable.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <button 
          class="edit-btn"
          data-id="${user.id}"
          data-name="${user.name}"
          data-email="${user.email}">
          Edit
        </button>
        <button onclick="deleteUser('${user.id}')">
          Delete
        </button>
      </td>
    </tr>
  `).join("");

  attachEditEvents();
}

/* ---------- EDIT HANDLER ---------- */
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

/* ---------- CREATE / UPDATE ---------- */
form.addEventListener("submit", async e => {
  e.preventDefault();

  if (editUserId) {
    const mutation = `
      mutation ($id: ID!, $name: String!, $email: String!) {
        updateUser(id: $id, name: $name, email: $email)
      }
    `;

    await fetchGraphQL(mutation, {
      id: editUserId,
      name: nameInput.value,
      email: emailInput.value
    });

    editUserId = null;
    submitBtn.innerText = "Add User";
  } else {
    const mutation = `
      mutation ($name: String!, $email: String!) {
        addUser(name: $name, email: $email)
      }
    `;

    await fetchGraphQL(mutation, {
      name: nameInput.value,
      email: emailInput.value
    });
  }

  form.reset();
  loadUsers();
});

/* ---------- DELETE ---------- */
async function deleteUser(id) {
  const mutation = `
    mutation ($id: ID!) {
      deleteUser(id: $id)
    }
  `;

  await fetchGraphQL(mutation, { id });
  loadUsers();
}

/* ---------- INITIAL LOAD ---------- */
loadUsers();
