// Import Firebase modules (ensure consistent versions)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, addDoc, collection, query, where} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
// Firebase config
const firebaseConfig = {
apiKey: "AIzaSyCbSqQtKpBtfu6EqTCyk5uTNkFiEc7jejU",
authDomain: "oxford-graduate-admission.firebaseapp.com",
projectId: "oxford-graduate-admission",
storageBucket: "oxford-graduate-admission.appspot.com",
messagingSenderId: "992593803011",
appId: "1:992593803011:web:4c853113afb814b9c7db36",
measurementId: "G-Y3YHM86E5Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getFirestore(app);

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
async function toggleAssignReviewerButton(uid) {
    const q = query(collection(db, "assignedUsers"), where("applicantID", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        const assignedReviewerName = data.assignedReviewerName;

        // Select the specific button for this applicant's UID
        const assignButton = document.querySelector(`.assign-btn[data-uid="${uid}"]`);
        if (assignButton) {
            assignButton.textContent = `Reviewer: ${assignedReviewerName}`;
        } else {
            console.warn(`Assign button not found for UID: ${uid}`);
        }
    } else {
        // If no reviewer is assigned yet, you might want to reset the button text
        const assignButton = document.querySelector(`.assign-btn[data-uid="${uid}"]`);
        if (assignButton) {
            assignButton.textContent = `Assign Reviewer`;
        }
    }
}


// Function to save the form data to Firestore (saving reviewer name)
async function saveFormDataToFirestore(uid) {
    const reviewerSelect = document.getElementById("reviewer");
    const reviewerID = reviewerSelect.value;

    // Add this inside your saveFormDataToFirestore() before `addDoc(...)`
    const existingAssignmentQuery = query(collection(db, "assignedUsers"), where("applicantID", "==", uid));
    const existingAssignmentSnapshot = await getDocs(existingAssignmentQuery);

    if (!existingAssignmentSnapshot.empty) {
        console.warn("Applicant already assigned to a reviewer.");
        alert("This applicant has already been assigned to a reviewer.");
        return;
    }


    if (!reviewerID) {
        console.error("No reviewer selected.");
        return;
    }

    try {
        // Check if the applicant is already assigned
        const existingAssignmentQuery = query(
            collection(db, "assignedUsers"),
            where("applicantID", "==", uid)
        );
        const existingAssignmentSnapshot = await getDocs(existingAssignmentQuery);

        if (!existingAssignmentSnapshot.empty) {
            console.warn(`Applicant with UID ${uid} is already assigned.`);
            // Optionally, you could inform the user here.
            return;
        }

        // Fetch reviewer details from Realtime Database
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);

        if (!snapshot.exists()) {
            console.error("No users found in the database.");
            return;
        }

        const users = snapshot.val();
        const reviewer = users[reviewerID];

        if (!reviewer || reviewer.role !== "Reviewer") {
            console.error("Selected user is not a reviewer.");
            return;
        }


        const assignedReviewerName = reviewer.email || reviewer.username || "Unnamed Reviewer";

        // Fetch applicant's details from Firestore
        const applicantDocRef = doc(db, "users", uid, "forms", "form1");
        const applicantDocSnap = await getDoc(applicantDocRef);

        if (!applicantDocSnap.exists()) {
            console.error("Applicant not found in Firestore.");
            return;
        }

        const applicantData = applicantDocSnap.data();
        const applicantGivenName = applicantData.givenName || "Unnamed";
        const applicantFamilyName = applicantData.familyName || "";
        const applicantFullName = `${applicantGivenName} ${applicantFamilyName}`;
        const applicantCourseCode = applicantData.courseCode || "Unknown";
        const applicantCourseTitle = applicantData.courseTitle || "Unknown";

        // Save the reviewer assignment to Firestore
        const assignedUsersCollection = collection(db, "assignedUsers");
        await addDoc(assignedUsersCollection, {
            applicantID: uid,
            applicantName: applicantFullName,
            applicantCourseCode: applicantCourseCode,
            applicantCourseTitle: applicantCourseTitle,
            reviewerID: reviewerID,
            assignedReviewerName: assignedReviewerName,
            assignedAt: new Date().toISOString(),
        });

        console.log("✅ Reviewer assigned successfully!");
        toggleAssignReviewerButton(uid); // Update button text after assignment
    } catch (error) {
        console.error("❌ Error saving reviewer assignment: ", error);
    }
    // Fetch reviewers on initial load (consider if this is needed here after saving)
    fetchReviewer();
}
});