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
        // Section N: Supporting documents checklist
        TranscriptsCheck: document.getElementById('TranscriptsCheck').checked,
        CVCheck: document.getElementById('CVCheck').checked,
        StatementCheck: document.getElementById('StatementCheck').checked,
        WW1Check: document.getElementById('WW1Check').checked,
        WW2Check: document.getElementById('WW2Check').checked,
        longerWrittenWorkCheck: document.getElementById('longerWrittenWorkCheck').checked,
        portfolioCheck: document.getElementById('portfolioCheck').checked,
        EnglishTestCheck: document.getElementById('EnglishTestCheck').checked,
        GRECheck: document.getElementById('GRECheck').checked,
        OtherItemsCheck: document.getElementById('OtherItemsCheck').checked,
        scholarshipCheck: document.getElementById('scholarshipCheck').checked,
        noScholarshipAdded: document.getElementById('noScholarshipAdded').value,

        // Section O: Application fee payment
        orderNumber: document.getElementById('orderNumber').value,
        waiverOption: document.querySelector('input[name="waiverOption"]:checked')?.value || null,
        confirmAfford: document.getElementById('confirmAfford').checked,
        confirmEntry: document.getElementById('confirmEntry').checked,
    };
}

// Function to save form data to Firestore
async function saveFormDataToFirestore(user) {
    const formData = getFormData();
        try {
            const docRef = doc(db, "users", user.uid, "forms", "form6");
            await setDoc(docRef, { formPage6Data: formData }, { merge: true });
            console.log("Form data saved to Firestore.");
        } catch (error) {
            console.error("Error saving form data to Firestore:", error);
        }
}

// Function to populate form fields
function populateFormFields(formData) {
    Object.keys(formData).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                console.log(`Populating checkbox: ${key}, value: ${formData[key]}`); // Debugging log
                element.checked = formData[key] || false;
            } else if (element.type === 'number' || element.type === 'text') {
                console.log(`Populating input: ${key}, value: ${formData[key]}`); // Debugging log
                element.value = formData[key] || '';
            }
        } else {
            console.warn(`Element with id "${key}" not found in the DOM.`); // Debugging log
        }
    });
}

// Function to load form data from Firestore
async function loadFormDataFromFirestore(user) {
    try {
        const docRef = doc(db, "users", user.uid, "forms", "form6");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const formData = docSnap.data().formPage6Data || {};
            console.log("Form data loaded from Firestore:", formData); // Debugging log
            populateFormFields(formData); // Populate fields after data is fetched
        } else {
            console.log("No form data found for this user.");
        }
    } catch (error) {
        console.error("Error loading form data from Firestore:", error);
    }
}

// Add event listener to the "Continue" button
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

        // Add event listeners to form fields to save data on change
        const formFields = document.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('change', async () => {
                await saveFormDataToFirestore(user);
            });
        });

        // Handle back button click
        backButton.addEventListener('click', async (event) => {
            event.preventDefault();
            await saveFormDataToFirestore(user);
            window.location.href = "form_page5.html";
        });

        // Handle continue button click
        continueButton.addEventListener('click', async (event) => {
            event.preventDefault();
            await saveFormDataToFirestore(user);
            window.location.href = "form_page7.html";
        });
    });
});
