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
  const reviewerSelect = document.getElementById('reviewer');
  reviewerSelect.innerHTML = ''; // Clear existing options

  let hasReviewer = false;

  for (const userId in users) {
      const user = users[userId];

      if (user.role === "Reviewer") {
          hasReviewer = true;

          const option = document.createElement('option');
          option.value = userId; // or user.username or email depending on your use case
          option.textContent = user.username || "Unnamed Reviewer";

          reviewerSelect.appendChild(option);
      }
  }

  if (!hasReviewer) {
      const option = document.createElement('option');
      option.disabled = true;
      option.textContent = 'No reviewers found';
      reviewerSelect.appendChild(option);
  }
}

document.querySelector('.btn-warning').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent form submission if this button is in a form

  const selectedReviewerId = document.getElementById('reviewer').value;

  // You can optionally store the reviewer assignment here, e.g., in Firebase
  // For now, just redirect
  console.log("Assigned reviewer ID:", selectedReviewerId); // Debug log

  // Redirect to admin dashboard
  window.location.href = 'admin_dashboard.html';
});


// Call fetchUsers when the page loads
document.addEventListener('DOMContentLoaded', fetchUsers);
