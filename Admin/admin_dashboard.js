// Import Firebase SDK modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js';

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
    const usersRef = ref(database, 'users'); // Path to your 'users' node in the Realtime Database
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

// Function to display users in the table
function displayUsers(users) {
    const userTableBody = document.querySelector('tbody');
    userTableBody.innerHTML = ''; // Clear existing rows

    for (const userId in users) {
        const user = users[userId];
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.password}</td>
        <td>${user.role}</td>
        <td>
            <button class="btn btn-sm btn-outline-secondary">Edit</button>
            <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('${userId}')">Delete</button>
        </td>
        `;
        userTableBody.appendChild(row);
    }
}

// Function to ask for confirmation before deleting a user
function confirmDelete(userId) {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
        window.location.href = `delete_user.html?uid=${userId}`;
    }
}

// Function to delete a user from Firebase using their UID
function deleteUser(userId) {
    const userRef = ref(database, 'users/' + userId);  // Using UID as the reference to delete the specific user
    remove(userRef).then(() => {
        alert("User deleted successfully.");
        fetchUsers();  // Refresh the user list
    }).catch((error) => {
        console.error("Error deleting user: ", error);
        alert("Error deleting user.");
    });
}

// Call fetchUsers when the page loads
document.addEventListener('DOMContentLoaded', fetchUsers);
