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
        // Section 2: Socio-economic background
        ukEducation: document.querySelector('input[name="ukEducation"]:checked')?.id || null,
        gcseSchoolName: document.getElementById('floatingInput')?.value || '',
        gcseSchoolPostcode: document.getElementById('floatingInput')?.value || '',
        gcseSchoolType: document.querySelector('input[name="gcseSchoolType"]:checked')?.id || null,
        aLevelSchoolName: document.getElementById('floatingInput')?.value || '',
        aLevelSchoolPostcode: document.getElementById('floatingInput')?.value || '',
        aLevelSchoolType: document.querySelector('input[name="aLevelSchoolType"]:checked')?.id || null,
        homePostcode: document.getElementById('homePostcode')?.value || '',
        freeSchoolMeals: document.querySelector('input[name="freeSchoolMeals"]:checked')?.id || null,
        parentsUndergradDegree: document.querySelector('input[name="parentsUndergradDegree"]:checked')?.id || null,
        parent1Job: Array.from(document.querySelectorAll('input[name="parent1Job"]:checked')).map(el => el.value),
        parent2Job: Array.from(document.querySelectorAll('input[name="parent2Job"]:checked')).map(el => el.value),
        undergradUK: document.querySelector('input[name="undergradUK"]:checked')?.id || null,
        fundingSources: {
            govLoan: document.getElementById('govLoan')?.checked || false,
            parentFinancial: document.getElementById('parentFinancial')?.checked || false,
            preferNotFunding: document.getElementById('preferNotFunding')?.checked || false,
            termTimeWork: document.getElementById('termTimeWork')?.checked || false,
            scholarship: document.getElementById('scholarship')?.checked || false,
            otherFunding: document.getElementById('otherFunding')?.checked || false,
            personalSavings: document.getElementById('personalSavings')?.checked || false,
            uniBursary: document.getElementById('uniBursary')?.checked || false,
            otherFundingDetails: document.getElementById('otherFundingDetails')?.value || ''
        },
        stateCare: document.querySelector('input[name="stateCare"]:checked')?.id || null
    };
}

// Function to save form data to Firestore
async function saveFormDataToFirestore(user) {
    const formData = getFormData();
        try {
            const docRef = doc(db, "users", user.uid, "forms", "form8");
            await setDoc(docRef, { formPage8Data: formData }, { merge: true });
            console.log("Form data saved to Firestore.");
        } catch (error) {
            console.error("Error saving form data to Firestore:", error);
        }
}

// Function to load form data from Firestore
async function loadFormDataFromFirestore(user) {
    try {
            const docRef = doc(db, "users", user.uid, "forms", "form8");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const formData = docSnap.data().formPage8Data || {};
                populateFormFields(formData);
            } else {
                console.log("No form data found for this user.");
            }
        } catch (error) {
            console.error("Error loading form data from Firestore:", error);
        }
}

// Function to populate form fields
function populateFormFields(formData) {
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
    // Get form data from the DOM
    const formData = getFormData();
    // Populate form fields with data
    populateFormFields(formData);

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

    // Handle back button click
    backButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await saveFormDataToFirestore(user);
        window.location.href = "form_page7.html";
    });

    // Handle continue button click
    continueButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await saveFormDataToFirestore(user);
        window.location.href = "form_page9.html";
    });
    });
});
