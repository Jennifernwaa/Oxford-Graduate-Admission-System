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
        // Section P: Final checklist
        filledAllSections: document.getElementById('filledAllSections').checked,
        gatheredMaterials: document.getElementById('gatheredMaterials').checked,
        requestedReferences: document.getElementById('requestedReferences').checked,
        paidFee: document.getElementById('paidFee').checked,

        // Section 1: Ethnicity & Diversity
        ethnicity: Array.from(document.querySelectorAll('input[name="ethnicity"]:checked')).map(el => el.id),

        // Religion or belief
        religion: document.querySelector('input[name="religion"]:checked')?.id || null,

        // Sexual orientation
        sexualOrientation: document.querySelector('input[name="sexualOrientation"]:checked')?.id || null,

        // Gender
        gender: document.querySelector('input[name="gender"]:checked')?.id || null,

        // Caring responsibilities
        careResponsibilities: Array.from(document.querySelectorAll('input[type="checkbox"][id^="child"], input[type="checkbox"][id^="disabledAdult"], input[type="checkbox"][id^="olderAdult"], input[type="checkbox"][id^="otherCare"], input[type="checkbox"][id^="noCare"], input[type="checkbox"][id^="preferNotCare"]'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value)
        };
}

// Function to save form data to Firestore
async function saveFormDataToFirestore(user) {
    const formData = getFormData();
        try {
            const docRef = doc(db, "users", user.uid, "forms", "form7");
            await setDoc(docRef, { formPage7Data: formData }, { merge: true });
            console.log("Form data saved to Firestore.");
        } catch (error) {
            console.error("Error saving form data to Firestore:", error);
        }
}

// Function to load form data from Firestore
async function loadFormDataFromFirestore(user) {
    try {
            const docRef = doc(db, "users", user.uid, "forms", "form7");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const formData = docSnap.data().formPage7Data || {};
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
        const value = formData[key];

        // Handle radio buttons
        const radioGroup = document.querySelectorAll(`input[name="${key}"]`);
        if (radioGroup.length > 0 && radioGroup[0].type === "radio") {
            radioGroup.forEach(radio => {
                radio.checked = radio.value === value;
            });
            return;
        }

        // Handle checkbox groups (arrays of values)
        if (Array.isArray(value)) {
            value.forEach(val => {
                const checkbox = document.querySelector(`input[type="checkbox"][value="${val}"]`);
                if (checkbox) checkbox.checked = true;
            });
            return;
        }

        // Handle individual checkboxes and text inputs
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = value || false;
            } else {
                element.value = value || '';
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
        window.location.href = "form_page6.html";
    });

    // Handle continue button click
    continueButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await saveFormDataToFirestore(user);
        window.location.href = "form_page8.html";
    });
    });
});
