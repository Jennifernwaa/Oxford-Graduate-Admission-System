// Import Firebase SDK modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getDatabase, ref, get, set, remove } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbSqQtKpBtfu6EqTCyk5uTNkFiEc7jejU",
  authDomain: "oxford-graduate-admission.firebaseapp.com",
  projectId: "oxford-graduate-admission",
  storageBucket: "oxford-graduate-admission.firebasestorage.app",
  messagingSenderId: "992593803011",
  appId: "1:992593803011:web:4c853113afb814b9c7db36",
  measurementId: "G-Y3YHM86E5Z",
  databaseURL: "https://oxford-graduate-admission-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to fetch users from Firebase
function fetchUsers() {
    const usersRef = ref(database, 'users');
    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const users = snapshot.val();
            displayUsers(users);
        } else {
            console.log("No users found.");
        }
    }).catch((error) => {
        console.error("Error fetching data: ", error);
    });
}

function displayUsers(users) {
    const userTableBody = document.querySelector('tbody');
    userTableBody.innerHTML = '';

    for (const userId in users) {
        const user = users[userId];
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.password}</td>
        <td>${user.role}</td>
        <td>
            <button class="btn btn-sm btn-outline-secondary" onclick='openEditModal("${userId}", ${JSON.stringify(user).replace(/'/g, "\\'")})'>Edit</button>
            <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('${userId}')">Delete</button>
        </td>
        `;
        userTableBody.appendChild(row);
    }
}

// Function triggered by the Delete button
window.confirmDelete = function(userId) {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
        // Reference to the user's data in the 'users' node
        const userRef = ref(database, 'users/' + userId);

        // Remove the user data from Firebase
        remove(userRef)
            .then(() => {
                alert("User deleted successfully!");
                fetchUsers();  // Refresh the list of users
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            });
    }
}

window.openEditModal = function(userId, userData) {
    document.getElementById('editUserId').value = userId;
    document.getElementById('editUsername').value = userData.username;
    document.getElementById('editPassword').value = userData.password;
    document.getElementById('editRole').value = userData.role;
    document.getElementById('editUserModal').style.display = 'block';
};

window.closeEditModal = function() {
    document.getElementById('editUserModal').style.display = 'none';
};

window.saveUserChanges = function() {
    const userId = document.getElementById('editUserId').value;
    const username = document.getElementById('editUsername').value;
    const password = document.getElementById('editPassword').value;
    const role = document.getElementById('editRole').value;

    const userRef = ref(database, 'users/' + userId);
    set(userRef, {
        username,
        password,
        role
    }).then(() => {
        alert("User updated successfully!");
        closeEditModal();
        fetchUsers();
    }).catch((error) => {
        console.error("Error updating user:", error);
        alert("Failed to update user.");
    });
};


// Fetch users on load
document.addEventListener('DOMContentLoaded', fetchUsers);

