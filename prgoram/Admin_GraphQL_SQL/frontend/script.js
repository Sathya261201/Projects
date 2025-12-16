const API = "http://localhost:3000/graphql";

async function fetchGraphQL(query, variables = {}) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables })
  });
  return res.json();
}

document.getElementById("userForm").addEventListener("submit", async e => {
  e.preventDefault();

  const query = `
    mutation ($name: String!, $email: String!) {
      addUser(name: $name, email: $email)
    }
  `;

  await fetchGraphQL(query, {
    name: name.value,
    email: email.value
  });

  e.target.reset();
  loadUsers();
});

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
  const query = `
    mutation ($id: ID!) {
      deleteUser(id: $id)
    }
  `;
  await fetchGraphQL(query, { id });
  loadUsers();
}

loadUsers();
