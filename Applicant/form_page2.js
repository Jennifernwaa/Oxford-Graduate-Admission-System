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
    homeAddress: document.getElementById('homeAddress').value,
    city: document.getElementById('city').value,
    postcode: document.getElementById('PostCode').value,
    state: document.getElementById('State').value,
    country: document.getElementById('Country').value,
    correspondenceAddress: document.getElementById('correspondenceAddress').value,
    correspondenceCity: document.getElementById('correspondenceCity').value,
    correspondencePostcode: document.getElementById('correspondencePostCode').value,
    correspondenceState: document.getElementById('correspondenceState').value,
    correspondenceCountry: document.getElementById('correspondenceCountry').value,
    effectiveFrom: document.getElementById('fromDate').value,
    effectiveTo: document.getElementById('toDate').value,
    telephoneCountryCode: document.getElementById('countryCode').value,
    telephoneAreaCode: document.getElementById('areaCode').value,
    telephoneNumber: document.getElementById('phoneNumber').value,
    alternativePhoneNumber: document.getElementById('alternativePhone').value,
    emailAddress: document.getElementById('email').value,
    alternativeEmailAddress: document.getElementById('alternativeEmail').value,
    thirdPartyYes: document.getElementById('thirdPartyYes').checked,
    thirdPartyNo: document.getElementById('thirdPartyNo').checked,
    thirdPartyName: document.getElementById('thirdPartyName').value,
    thirdPartyEmail: document.getElementById('thirdPartyEmail').value,
    thirdPartyDOB: document.getElementById('thirdPartyDOB').value,
    countryOfBirth: document.getElementById('countryOfBirth').value,
    visaYes: document.getElementById('visaYes').checked,
    visaNo: document.getElementById('visaNo').checked,
    visaUncertain: document.getElementById('visaUncertain').checked,
    passportNationality: document.getElementById('passportNationality').value,
    passportStartDate: document.getElementById('passportStartDate').value,
    passportNumber: document.getElementById('passportNumber').value,
    passportCountry: document.getElementById('passportCountry').value,
    passportExpiryDate: document.getElementById('passportExpiry').value,
    dualNationality: document.getElementById('dualNationality').value,
    currentCountryOfResidence: document.getElementById('currentCountry').value,
    residenceFrom: document.getElementById('residenceFrom').value,
    residenceTo: document.getElementById('residenceTo').value,
    euYes: document.getElementById('euYes').checked,
    euNo: document.getElementById('euNo').checked,
    previousCountryOfResidence: document.getElementById('previousCountryOfResidence').value,
    previousResidenceFrom: document.getElementById('previousFrom').value,
    previousResidenceTo: document.getElementById('previousTo').value,
};

  try {
      const formsCollectionRef = collection(db, "users", user.uid, "forms");
      await addDoc(formsCollectionRef, formData);
      alert("Form data saved!");
      window.location.href = "daisysection3.html";
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

