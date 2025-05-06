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
function fetchReviewer() {
    const usersRef = ref(database, 'users'); // Path to your 'users' node in the Realtime Database
    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const users = snapshot.val();
            displayReviewer(users);
        } else {
            console.log("No users found.");
        }
    }).catch((error) => {
        console.error("Error fetching data: ", error);
    });
}

// Function to display reviewers in the dropdown
function displayReviewer(users) {
    const reviewerSelect = document.getElementById('reviewer');
    reviewerSelect.innerHTML = ''; // Clear existing options

    let hasReviewer = false;

    for (const userId in users) {
        const user = users[userId];

        if (user.role === "Reviewer") {
            hasReviewer = true;

            const option = document.createElement('option');
            option.value = userId; // Use userId as the value
            option.textContent = user.username || "Unnamed Reviewer"; // Display username or "Unnamed Reviewer"

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

// Delegate click event for Assign Reviewer buttons
document.querySelector("#assign-reviewer").addEventListener("click", function (e) {
    if (e.target.matches(".btn-outline-secondary")) {
        const uid = e.target.getAttribute("data-uid");

        // Set the UID in the hidden input field
        const uidInput = document.getElementById("assign-uid");
        uidInput.value = uid;

        // Fetch and display reviewers when the modal is triggered
        fetchReviewer();

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById("assignReviewerModal"));
        modal.show();
    }
});

// Delegate form submit event for Assign Reviewer form
document.getElementById("assignReviewerForm").addEventListener("submit", function (e) {
    e.preventDefault();  // Prevent the default form submission behavior

    // Get the selected reviewer ID and applicant UID from form elements
    const selectedReviewerId = document.getElementById("reviewer").value;
    const assignedUid = document.getElementById("assign-uid").value;

    // Debug log for assigned reviewer and applicant UID
    console.log("Assigned Reviewer ID:", selectedReviewerId, "to UID:", assignedUid);

    // Optional: Save the reviewer assignment in Firebase (e.g., Realtime DB or Firestore)
    // You can add this logic to save the assignment

    // Hide the modal after assignment
    const modal = bootstrap.Modal.getInstance(document.getElementById("assignReviewerModal"));
    modal.hide();

    // Optionally redirect or update UI
    window.location.href = 'admin_dashboard.html';
});

// Call fetchReviewer when the page loads
document.addEventListener('DOMContentLoaded', fetchReviewer);
