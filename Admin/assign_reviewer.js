// Import Firebase SDK modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
} from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

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
const firestore = getFirestore(app);

let selectedUid = null; // Declare selectedUid in a scope accessible to both event listeners

// Fetch reviewers from Realtime Database
function fetchReviewer() {
    const usersRef = ref(database, 'users');
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

// Display reviewers in dropdown
function displayReviewer(users) {
    const reviewerSelect = document.getElementById('reviewer');
    reviewerSelect.innerHTML = '';

    let hasReviewer = false;

    for (const userId in users) {
        const user = users[userId];
        if (user.role === "Reviewer") {
            hasReviewer = true;
            const option = document.createElement('option');
            option.value = userId;
            option.textContent = user.email || user.username || "Unnamed Reviewer";
            option.setAttribute("data-email", user.email || "");
            reviewerSelect.appendChild(option);
        }
    }

    if (!hasReviewer) {
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = 'No reviewers found';
        reviewerSelect.appendChild(option);

        // Show "Assign Reviewer" button if no reviewers are found
        const assignButton = document.getElementById("assignReviewerButton");
        if (assignButton) {
            assignButton.style.display = 'block'; // Show the button
        }
    } else {
        // Hide "Assign Reviewer" button if reviewers exist
        const assignButton = document.getElementById("assignReviewerButton");
        if (assignButton) {
            assignButton.style.display = 'none'; // Hide the button
        }
    }
}

// Wait for the DOM to be fully loaded before running any script
document.addEventListener("DOMContentLoaded", () => {
    // Fetch reviewers immediately when the page loads
    fetchReviewer();

    // Delegate click event to the document for dynamically added buttons
    document.addEventListener("click", function (e) {
        // Check if the clicked element is the Assign Reviewer button
        if (e.target.matches(".assign-btn")) {
            const uid = e.target.getAttribute("data-uid");

            document.getElementById("assign-uid").value = uid;
            selectedUid = uid; // Set the selectedUid here

            fetchReviewer(); // Fetch reviewers and populate the dropdown

            const modal = new bootstrap.Modal(document.getElementById("assignReviewerModal"));
            modal.show(); // Open the modal

            // Toggle the button text based on reviewer assignment
            toggleAssignReviewerButton(uid);
        }
    });

    // Handle the "Continue" button in the modal
    const continueBtn = document.getElementById("assignReviewer");
    if (continueBtn) {
        continueBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            if (selectedUid) {
                await saveFormDataToFirestore(selectedUid); // Save function
                const modal = bootstrap.Modal.getInstance(document.getElementById("assignReviewerModal"));
                modal.hide(); // Hide the modal after successful assignment
                selectedUid = null; // Reset selectedUid
                document.getElementById('reviewer').value = ''; // Clear the reviewer selection
            } else {
                console.error("No applicant selected.");
            }
        });
    }

    // Function to fetch the reviewer and toggle button text
    function toggleAssignReviewerButton(uid) {
        const docRef = doc(firestore, "users", uid);
        getDoc(docRef).then(docSnap => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                const assignedReviewerName = userData.assignedReviewerName;

                const assignButton = document.querySelector(`.assign-btn[data-uid="${uid}"]`);
                if (assignedReviewerName) {
                    assignButton.textContent = `Reviewer: ${assignedReviewerName}`; // Update button with reviewer name
                } else {
                    assignButton.textContent = "Assign Reviewer"; // Default text if no reviewer is assigned
                }
            } else {
                console.error("No such document!");
            }
        }).catch(error => {
            console.error("Error fetching document: ", error);
        });
    }

    // Function to save the form data to Firestore (saving reviewer name)
    async function saveFormDataToFirestore(uid) {
        const reviewerSelect = document.getElementById("reviewer");
        let assignedReviewerName = null;

        // Get the selected reviewer's name
        if (reviewerSelect && reviewerSelect.value) {
            const selectedOption = reviewerSelect.options[reviewerSelect.selectedIndex];
            assignedReviewerName = selectedOption.textContent; // Save the reviewer name
        }

        if (!assignedReviewerName) {
            console.error("No reviewer selected.");
            return;
        }

        try {
            // Ensure the Firestore document path is correct
            const docRef = doc(firestore, "users", uid);

            await setDoc(docRef, {
                assignedReviewerName, // Save the reviewer's name here
            }, { merge: true });

            console.log("✅ Reviewer assigned successfully!");
            toggleAssignReviewerButton(uid); // Update button text after assignment
        } catch (error) {
            console.error("❌ Error saving reviewer assignment: " + error);
        }

        // Fetch reviewers on initial load
        fetchReviewer();
    }
});
