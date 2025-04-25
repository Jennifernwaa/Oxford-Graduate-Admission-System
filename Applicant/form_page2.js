// Import Firebase modules
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

// Function to get form data from the DOM
function getFormData() {
    return {
        homeAddress: document.getElementById('homeAddress').value,
        city: document.getElementById('city').value,
        PostCode: document.getElementById('PostCode').value,
        State: document.getElementById('State').value,
        Country: document.getElementById('Country').value,
        correspondenceAddress: document.getElementById('correspondenceAddress').value,
        correspondenceCity: document.getElementById('correspondenceCity').value,
        correspondencePostCode: document.getElementById('correspondencePostCode').value,
        correspondenceState: document.getElementById('correspondenceState').value,
        correspondenceCountry: document.getElementById('correspondenceCountry').value,
        effectiveFrom: document.getElementById('effectiveFrom').value,
        effectiveTo: document.getElementById('effectiveTo').value,
        telephoneCountryCode: document.getElementById('telephoneCountryCode').value,
        telephoneAreaCode: document.getElementById('telephoneAreaCode').value,
        telephoneNumber: document.getElementById('telephoneNumber').value,
        alternativePhone: document.getElementById('alternativePhone').value,
        email: document.getElementById('email').value,
        alternativeEmail: document.getElementById('alternativeEmail').value,
        thirdPartyName: document.getElementById('thirdPartyName').value,
        thirdPartyEmail: document.getElementById('thirdPartyEmail').value,
        thirdPartyDOB: document.getElementById('thirdPartyDOB').value,
        countryOfBirth: document.getElementById('countryOfBirth').value,
        passportNationality: document.getElementById('passportNationality').value,
        passportStartDate: document.getElementById('passportStartDate').value,
        passportNumber: document.getElementById('passportNumber').value,
        passportCountry: document.getElementById('passportCountry').value,
        passportExpiryDate: document.getElementById('passportExpiryDate').value,
        dualNationality: document.getElementById('dualNationality').value,
        currentCountryOfResidence: document.getElementById('currentCountryOfResidence').value,
        residenceFrom: document.getElementById('residenceFrom').value,
        residenceTo: document.getElementById('residenceTo').value,
        previousCountryOfResidence: document.getElementById('previousCountryOfResidence').value,
        previousResidenceFrom: document.getElementById('previousResidenceFrom').value,
        previousResidenceTo: document.getElementById('previousResidenceTo').value,

        // Radio Buttons
        nominatedThirdParty: document.querySelector('input[name="nominatedThirdParty"]:checked')?.value || '',
        visaRequirement: document.querySelector('input[name="visaRequirement"]:checked')?.value || '',
        euResident: document.querySelector('input[name="euResident"]:checked')?.value || '',
    };
}

// Function to populate the form with data
function populateFormData(formData) {
    Object.keys(formData).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = formData[key] || false;
            } else {
                element.value = formData[key] || '';
            }
        }
    });
}

// Function to save form data to Firestore
async function saveFormDataToFirestore(user) {
    const formData = getFormData();
    try {
        const docRef = doc(db, "users", user.uid, "forms", "form2");
        await setDoc(docRef, { formPage2Data: formData }, { merge: true });
        console.log("Form data saved to Firestore.");
    } catch (error) {
        console.error("Error saving form data to Firestore:", error);
    }
}

// Function to load form data from Firestore
async function loadFormDataFromFirestore(user) {
    try {
        const docRef = doc(db, "users", user.uid, "forms", "form2");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const formData = docSnap.data().formPage2Data || {};
            populateFormData(formData);
        } else {
            console.log("No form data found for this user.");
        }
    } catch (error) {
        console.error("Error loading form data from Firestore:", error);
    }
}

// Event listeners for buttons
document.addEventListener('DOMContentLoaded', () => {
    const continueButton = document.getElementById('continue');
    const backButton = document.getElementById('back');

    // Watch for auth state
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            alert("You are not logged in!");
            window.location.href = "login_applicant_page.html";
            return;
        }
        console.log("User authenticated, UID:", user.uid);

        // Load form data from Firestore and populate fields
        await loadFormDataFromFirestore(user);
        // Get form data from the DOM
        const formData = getFormData();
        // Populate form fields with data
        populateFormData(formData);
        // Add event listeners to form fields to save data on change
        const formFields = document.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('change', async () => {
                await saveFormDataToFirestore(user);
            });
        });
        // Add event listeners to form fields to save data on input
        formFields.forEach(field => {
            field.addEventListener('input', async () => {
                await saveFormDataToFirestore(user);
            });
        });
        // Add event listeners to form fields to save data on blur
        formFields.forEach(field => {
            field.addEventListener('blur', async () => {
                await saveFormDataToFirestore(user);
            });
        });
        // Add event listeners to form fields to save data on focus
        formFields.forEach(field => {
            field.addEventListener('focus', async () => {
                await saveFormDataToFirestore(user);
            });
        });
        // Add event listeners to form fields to save data on change
        formFields.forEach(field => {
            field.addEventListener('change', async () => {
                await saveFormDataToFirestore(user);
            });
        });
        // Add event listeners to form fields to save data on input
        formFields.forEach(field => {
            field.addEventListener('input', async () => {
                await saveFormDataToFirestore(user);
            });
        });

        // Handle back button click
        backButton.addEventListener('click', async (event) => {
            event.preventDefault();
            await saveFormDataToFirestore(user);
            window.location.href = "form_page1.html";
        });

        // Handle continue button click
        continueButton.addEventListener('click', async (event) => {
            event.preventDefault();
            await saveFormDataToFirestore(user);
            window.location.href = "form_page3.html";
        });
    });
});








