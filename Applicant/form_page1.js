// Import Firebase modules (ensure consistent versions)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Function to save form data to Firestore
async function saveFormDataToFirestore(user, formData) {
  try {
    const formDocRef = doc(db, "users", user.uid, "forms", "form1");
    await setDoc(formDocRef, formData);

  } catch (error) {
    console.error("Save error:", error);
    alert("Error: " + error.message);
  }
}

// Function to load form data from Firestore
async function loadFormDataFromFirestore(user) {
  try {
    const formDocRef = doc(db, "users", user.uid, "forms", "form1");
    const formDoc = await getDoc(formDocRef);
    if (formDoc.exists()) {
      return formDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Load error:", error);
    return null;
  }
}

// Function to populate form fields
function filledFormFields1(formData) {
  if (!formData) return;

  document.getElementById('courseCode').value = formData.courseCode || '';
  document.getElementById('courseTitle').value = formData.courseTitle || '';
  document.getElementById('researchProject').value = formData.researchProject || '';
  document.getElementById('supervisorName').value = formData.supervisorName || '';
  document.getElementById('interviewDates').value = formData.interviewDates || '';
  if (formData.researchDegree) {
    document.querySelector(`input[name="researchDegree"][value="${formData.researchDegree}"]`).checked = true;
  }
  if (formData.collegePreference === "No preference") {
    document.querySelector('input[name="collegePreference"][value="No preference"]').checked = true;
  } else {
    document.getElementById("collegePref").value = formData.collegePreference || '';
  }
  document.getElementById('givenName').value = formData.givenName || '';
  document.getElementById('preferredName').value = formData.preferredName || '';
  document.getElementById('middledName').value = formData.middleName || '';
  document.getElementById('familyName').value = formData.familyName || '';
  document.getElementById('titleName').value = formData.titleName || '';
  if (formData.gender) {
    document.querySelector(`input[name="gender"][value="${formData.gender}"]`).checked = true;
  }
  document.getElementById('dob').value = formData.dob || '';
}

// Add event listener to the "Continue" button
document.addEventListener('DOMContentLoaded', () => {
  const continueButton = document.getElementById('continue');

  // Watch for auth state
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("You are not logged in!");
      window.location.href = "login_applicant_page.html";
      return;
    }
    console.log("User authenticated, UID:", user.uid);

    // Load form data from Firestore and populate fields
    const formData = await loadFormDataFromFirestore(user);
    filledFormFields1(formData);

    // Handle "Continue" button click
    continueButton.addEventListener('click', async (event) => {
      event.preventDefault(); // Prevent default form submission
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

      // Save form data to Firestore
      await saveFormDataToFirestore(user, formData);

      // Navigate to the next page
      window.location.href = "form_page2.html";
    });
  });
});
