// Import Firebase modules (ensure consistent versions)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, addDoc, collection, query, where } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

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

let selectedUid = null; // For cross-function access

// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", () => {
  // Delegate Assign Reviewer button click
  document.addEventListener("click", function (e) {
    if (e.target.matches(".assign-btn")) {
      const uid = e.target.getAttribute("data-uid");
      document.getElementById("assign-uid").value = uid;
      selectedUid = uid;

      const modal = new bootstrap.Modal(document.getElementById("assignReviewerModal"));
      modal.show();

      toggleAssignReviewerButton(uid);
    }
  });

  // Handle "Continue" button in modal
    const continueBtn = document.getElementById("assignReviewer");
    if (continueBtn) {
    continueBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (selectedUid) {
        // Save the form data to Firestore
        await saveFormDataToFirestore(selectedUid);
        
        // Get the modal instance
        const modalElement = document.getElementById("assignReviewerModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        
        // Reset the UID and reviewer value
        selectedUid = null;
        document.getElementById('reviewer').value = '';
        
        // Hide the modal
        modal.hide();
        
        // Remove the backdrop manually (if necessary)
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove(); // Remove backdrop
        }
        } else {
        console.error("No applicant selected.");
        }
    });
    }


  // Toggle button label to show current assignment
  async function toggleAssignReviewerButton(uid) {
    const q = query(collection(db, "assignedUsers"), where("applicantID", "==", uid));
    const querySnapshot = await getDocs(q);
    const assignButton = document.querySelector(`.assign-btn[data-uid="${uid}"]`);

    if (assignButton) {
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        assignButton.textContent = `Reviewer: ${data.assignedReviewerName}`;
      } else {
        assignButton.textContent = `Assign Reviewer`;
      }
    }
  }

  // Save reviewer assignment to Firestore
  async function saveFormDataToFirestore(uid) {
    const reviewerSelect = document.getElementById("reviewer");
    const reviewerID = reviewerSelect.value;

    if (!reviewerID) {
      console.error("No reviewer selected.");
      return;
    }

    try {
      // Prevent duplicate assignments
      const existingAssignmentQuery = query(collection(db, "assignedUsers"), where("applicantID", "==", uid));
      const existingAssignmentSnapshot = await getDocs(existingAssignmentQuery);

      if (!existingAssignmentSnapshot.empty) {
        alert("This applicant has already been assigned to a reviewer.");
        return;
      }

      // Get reviewer info from Realtime DB
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);

      if (!snapshot.exists()) {
        console.error("No users found in database.");
        return;
      }

      const users = snapshot.val();
      const reviewer = users[reviewerID];

      if (!reviewer || reviewer.role !== "Reviewer") {
        console.error("Selected user is not a valid reviewer.");
        return;
      }

      const assignedReviewerName = reviewer.email || reviewer.username || "Unnamed Reviewer";

      // Get applicant info
      const applicantDocRef = doc(db, "users", uid, "forms", "form1");
      const applicantDocSnap = await getDoc(applicantDocRef);

      if (!applicantDocSnap.exists()) {
        console.error("Applicant form not found.");
        return;
      }

      const applicantData = applicantDocSnap.data();
      const applicantFullName = `${applicantData.givenName || "Unnamed"} ${applicantData.familyName || ""}`;
      const applicantCourseCode = applicantData.courseCode || "Unknown";
      const applicantCourseTitle = applicantData.courseTitle || "Unknown";

      // Save assignment
      await addDoc(collection(db, "assignedUsers"), {
        applicantID: uid,
        applicantName: applicantFullName,
        applicantCourseCode,
        applicantCourseTitle,
        reviewerID,
        assignedReviewerName,
        assignedAt: new Date().toISOString()
      });

      const formDocRef = doc(db, "users", uid);
      await setDoc(formDocRef, {
        assignedReviewerName: assignedReviewerName
      }, { merge: true });

      // ✅ Update users/{uid}/forms/form11 with status "Reviewed"
      const form11DocRef = doc(db, "users", uid, "forms", "form11");
      await setDoc(form11DocRef, {
        status: "Reviewed"
      }, { merge: true });

      console.log("✅ Reviewer assigned successfully!");
      toggleAssignReviewerButton(uid); // Update button text
    } catch (error) {
      console.error("❌ Error saving reviewer assignment: ", error);
    }
  }
});
