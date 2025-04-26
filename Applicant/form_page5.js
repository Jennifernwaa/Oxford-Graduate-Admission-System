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
        fundingInfo: document.querySelector('input[name="fundingInfo"]:checked')?.value || "",

        fundingSource1: document.getElementById('fundingSource1').value,
        fundingAmountPerYear1: document.getElementById('fundingAmountPerYear1').value,
        fundingPeriodCovered1: document.getElementById('fundingPeriodCovered1').value,
        status1: document.querySelector('input[name="status1"]:checked')?.value || "",
    
        fundingSource2: document.getElementById('fundingSource2').value,
        fundingAmountPerYear2: document.getElementById('fundingAmountPerYear2').value,
        fundingPeriodCovered2: document.getElementById('fundingPeriodCovered2').value,
        status2: document.querySelector('input[name="status2"]:checked')?.value || "",
    
        fundingSource3: document.getElementById('fundingSource3').value,
        fundingAmountPerYear3: document.getElementById('fundingAmountPerYear3').value,
        fundingPeriodCovered3: document.getElementById('fundingPeriodCovered3').value,
        status3: document.querySelector('input[name="status3"]:checked')?.value || "",
    
        fundingSource4: document.getElementById('fundingSource4')?.value || "",
        fundingAmountPerYear4: document.getElementById('fundingAmountPerYear4')?.value || "",
        fundingPeriodCovered4: document.getElementById('fundingPeriodCovered4')?.value || "",
        status4: document.querySelector('input[name="status4"]:checked')?.value || "",

        studentshipApply: document.querySelector('input[name="studentshipApply"]:checked')?.value || "",
        referenceCode: document.getElementById('referenceCode').value,

        hillFoundation: document.getElementById('hillFoundation').checked,
        ertegun: document.getElementById('ertegun').checked,
        ocis: document.getElementById('ocis').checked,
        weidenfeld: document.getElementById('weidenfeld').checked,
        oocdtp: document.getElementById('oocdtp').checked,
        granduniondtp: document.getElementById('granduniondtp').checked
    };
}

// Function to save form data to Firestore
async function saveFormDataToFirestore(user) {
    const formData = getFormData();
        try {
            const docRef = doc(db, "users", user.uid, "forms", "form5");
            await setDoc(docRef, { formPage5Data: formData }, { merge: true });
            console.log("Form data saved to Firestore.");
        } catch (error) {
            console.error("Error saving form data to Firestore:", error);
        }
}

// Function to load form data from Firestore
async function loadFormDataFromFirestore(user) {
    try {
            const docRef = doc(db, "users", user.uid, "forms", "form5");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const formData = docSnap.data().formPage5Data || {};
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
            return; // Skip the rest of the logic for radio buttons
        }

        // Handle checkboxes and text inputs
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
        window.location.href = "form_page4.html";
    });

    // Handle continue button click
    continueButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await saveFormDataToFirestore(user);
        window.location.href = "form_page6.html";
    });
    });
});
