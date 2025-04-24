// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCbSqQtKpBtfu6EqTCyk5uTNkFiEc7jejU",
  authDomain: "oxford-graduate-admission.firebaseapp.com",
  projectId: "oxford-graduate-admission",
  storageBucket: "oxford-graduate-admission.appspot.com",
  messagingSenderId: "992593803011",
  appId: "1:992593803011:web:4c853113afb814b9c7db36",
  measurementId: "G-Y3YHM86E5Z",
  databaseURL: "https://oxford-graduate-admission-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Watch for auth state
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("You are not logged in!");
    window.location.href = "login_applicant_page.html";
    return;
  }

  console.log("User authenticated, UID:", user.uid);
  alert("Logged in");

  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submit').addEventListener('click', function (event) {
      event.preventDefault();

      // Use `user` here directly
      const formData = {
        'Section A': {
          courseCode: document.getElementById('courseCode').value,
          courseTitle: document.getElementById('courseTitle').value,
          researchProject: document.getElementById('researchProject').value,
          supervisorName: document.getElementById('supervisorName').value,
          interviewDates: document.getElementById('interviewDates').value,
          researchDegree: document.querySelector('input[name="researchDegree"]:checked')?.value || ''
        }
      };

      const userRef = ref(db, `users/${user.uid}/form`); // Use `user`, not `currentUser`

      set(userRef, formData)
        .then(() => {
          alert("Form data saved!");
          window.location.href = "form_page2.html";
        })
        .catch((error) => {
          console.error("Save error:", error);
          alert("Error: " + error.message);
        });
    });
  });
});
