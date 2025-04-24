// Import Firebase modules (ensure consistent versions)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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
const auth = getAuth(app); // Ensure Auth is initialized after the app
const db = getFirestore(app); // Initialize Firestore


// Function to handle form submission
async function submitForm(user) {
  // Collect form data
  const formData = {
      courseCode: document.getElementById('courseCode').value,
      courseTitle: document.getElementById('courseTitle').value,
      researchProject: document.getElementById('researchProject').value,
      supervisorName: document.getElementById('supervisorName').value,
      interviewDates: document.getElementById('interviewDates').value,
      researchDegree: document.querySelector('input[name="researchDegree"]:checked')?.value || '',
      collegePreference: document.querySelector('input[name="collegePreference"]:checked')?.value === "No preference"
      ? "No preference"
      : document.getElementById("collegePref").value.trim(),
      givenName: document.getElementById('givenName').value,
      preferredName: document.getElementById('preferredName').value,
      middleName: document.getElementById('middledName').value,
      familyName: document.getElementById('familyName').value,
      titleName: document.getElementById('titleName').value,
      gender: document.querySelector('input[name="gender"]:checked')?.value || '',
      dob: document.getElementById('dob').value,
      submittedAt: new Date().toISOString() // Add a timestamp for tracking
  };

  try {
      const formsCollectionRef = collection(db, "users", user.uid, "forms");
      await addDoc(formsCollectionRef, formData);
      alert("Form data saved!");
      window.location.href = "form_page2.html";
  } catch (error) {
      console.error("Save error:", error);
      alert("Error: " + error.message);
  }
}

// Add event listener to the submit button
document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit');
  submitButton.addEventListener('click', async function (event) {
      event.preventDefault();
      if (auth.currentUser) {
          await submitForm(auth.currentUser);
      } else {
          alert("You are not logged in!");
          window.location.href = "login_applicant_page.html";
      }
  });
});

// Watch for auth state
onAuthStateChanged(auth, (user) => {
  if (!user) {
      alert("You are not logged in!");
      window.location.href = "login_applicant_page.html";
      return;
  }

  console.log("User authenticated, UID:", user.uid);
});

const userData = {
  // other fields...
  collegePreference: document.querySelector('input[name="collegePreference"]:checked')?.value === "No preference"
    ? "No preference"
    : document.getElementById("collegePref").value.trim()
};
