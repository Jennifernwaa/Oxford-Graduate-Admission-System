// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCbSqQtKpBtfu6EqTCyk5uTNkFiEc7jejU",
    authDomain: "oxford-graduate-admission.firebaseapp.com",
    databaseURL: "https://oxford-graduate-admission-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "oxford-graduate-admission",
    storageBucket: "oxford-graduate-admission.firebasestorage.app",
    messagingSenderId: "992593803011",
    appId: "1:992593803011:web:4c853113afb814b9c7db36",
    measurementId: "G-Y3YHM86E5Z"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let supportFile = null;
const supportFileInput = document.getElementById('supportFile');
const uploadSupportFileBtn = document.getElementById('uploadSupportFileBtn');

async function uploadSupportFileAndSaveToFirestore(user) {
    if (!supportFile) {
        alert("Please choose a PDF file before uploading.");
        return;
    }

    if (!user) {
        alert("User not authenticated.");
        return;
    }

    try {
        const storageRef = ref(storage, `users/${user.uid}/${supportFile.name}`);
        const snapshot = await uploadBytes(storageRef, supportFile);
        console.log("Upload successful:", snapshot);

        const downloadURL = await getDownloadURL(storageRef);
        console.log("Download URL:", downloadURL);

        // Save file URL to Firestore under form4
        const docRef = doc(db, "users", user.uid, "forms", "form6");
        await setDoc(docRef, {
            supportFileURL: downloadURL
        }, { merge: true });

        alert("File uploaded and URL saved to Firestore!");

    } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload file.");
    }
}

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
        feeWaiver: document.querySelector('input[name="feeWaiver"]:checked')?.value || "", // Captures the selected fee waiver option (yes/no)
        confirmAfford: document.getElementById('confirmAfford').checked,
        confirmEntry: document.getElementById('confirmEntry').checked,

        supportingDocuments: document.getElementById('supportFile').value
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

        // handle file
    });
}


// Function to load form data from Firestore
async function loadFormDataFromFirestore(user) {
    try {
        const docRef = doc(db, "users", user.uid, "forms", "form6");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const formData = docSnap.data().formPage6Data || {};
            const fileURL = docSnap.data().supportFileURL;

            // If file URL exists, create and insert link
            if (fileURL) {
                const fileLink = document.createElement('a');
                fileLink.href = fileURL;
                fileLink.textContent = "View previously uploaded file";
                fileLink.target = "_blank";
                document.body.appendChild(fileLink); // Or append to a specific div
            }
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

        uploadSupportFileBtn?.addEventListener('click', async () => {
            await uploadSupportFileAndSaveToFirestore(user);
        });

        // Load form data from Firestore and populate fields
        await loadFormDataFromFirestore(user);

            // File selection
        supportFileInput?.addEventListener('change', (event) => {
            supportFile = event.target.files[0];
            console.log("Selected file:", supportFile);
        });

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
