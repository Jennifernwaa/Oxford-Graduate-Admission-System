import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { handleStatus } from './statusHandler.js';

// Firebase config
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
const auth = getAuth(app);
const db = getFirestore(app);

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userUid = user.uid; // Get the authenticated user's UID
      console.log("Authenticated user UID:", userUid);

      const userFormsRef = collection(db, `users/${userUid}/forms`);
      const formsSnap = await getDocs(userFormsRef);

      if (!formsSnap.empty) {
        const formDoc = formsSnap.docs[0]; // Assuming one form per applicant
        const formData = formDoc.data();

        const fullName = `${formData.givenName || ''} ${formData.familyName || ''}`.trim();
        const courseCode = formData.courseCode || "N/A";
        const courseTitle = formData.courseTitle || "N/A";
        
        const { displayStatus, statusClass } = handleStatus(formData.status);

        // Use these variables wherever needed
        const applicationCard = `
          <h2>Your Application</h2>
          <div class="application-card">
            <h3>Application for ${fullName}</h3>
            <p>Program: ${courseCode} - ${courseTitle}</p>
            <p>Status: <span class="${statusClass}">${displayStatus.replace("-", " ")}</span></p>
            <a href="form_page1.html" class="details-link">Continue Application</a>
          </div>
        `;

        document.querySelector('.applications-overview').innerHTML = applicationCard;

        // Listen for real-time updates to the form status
        const formRef = doc(db, "users", userUid, "forms", "form11");
        onSnapshot(formRef, (docSnap) => {
          if (docSnap.exists()) {
            const updatedStatus = docSnap.data().status;
            const { displayStatus: updatedDisplayStatus, statusClass: updatedStatusClass } = handleStatus(updatedStatus);

            // Update the status dynamically
            document.querySelector('.application-card p span').innerHTML = updatedDisplayStatus.replace("-", " ");
            document.querySelector('.application-card p span').className = updatedStatusClass;
          }
        });
      } else {
        document.querySelector('.applications-overview').innerHTML = `
          <h2>Your Application</h2>
          <p>No application found. Please start your application.</p>
          <a href="form_page1.html" class="details-link">Start Application</a>
        `;
      }
    } else {
      window.location.href = "../Login/login_applicant_page.html"; // Redirect to login if not authenticated
    }
  });
});
