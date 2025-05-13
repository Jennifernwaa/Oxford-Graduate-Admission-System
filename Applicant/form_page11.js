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

let printNameFile = null;
const printNameFileInput = document.getElementById('printNameFile');
const printNameFileBtn = document.getElementById('printNameFileBtn');

async function uploadprintNameFileAndSaveToFirestore(user) {
    if (!printNameFile) {
        alert("Please ulpoad your signature .jpg before uploading.");
        return;
    }

    if (!user) {
        alert("User not authenticated.");
        return;
    }

    try {
        const storageRef = ref(storage, `users/${user.uid}/${printNameFile.name}`);
        const snapshot = await uploadBytes(storageRef, printNameFile);
        console.log("Upload successful:", snapshot);

        const downloadURL = await getDownloadURL(storageRef);
        console.log("Download URL:", downloadURL);

        // Save file URL to Firestore under form4
        const docRef = doc(db, "users", user.uid, "forms", "form11");
        await setDoc(docRef, {
            printNameFileURL: downloadURL
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
        confirmTrue: document.getElementById('confirmTrue').checked,
        confirmOriginal: document.getElementById('confirmOriginal').checked,
        confirmTerms: document.getElementById('confirmTerms').checked,
        date: document.getElementById('date').value,
        printName: document.getElementById('printName').value,
        signature: document.getElementById('signFile').value,
    };
}

// Function to save form data to Firestore
async function saveFormDataToFirestore(user) {
    const formData = getFormData();
    try {
        const docRef = doc(db, "users", user.uid, "forms", "form11");
        await setDoc(docRef, { formPage11Data: formData }, { merge: true });
        console.log("Form data saved to Firestore.");
    } catch (error) {
        console.error("Error saving form data to Firestore:", error);
    }
}

// Function to load form data from Firestore
async function loadFormDataFromFirestore(user) {
    try {
        const docRef = doc(db, "users", user.uid, "forms", "form11");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const formData = docSnap.data().formPage11Data || {};
            const fileURL = docSnap.data().printNameFileURL;

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
    printNameFileBtn?.addEventListener('click', async () => {
        await uploadprintNameFileAndSaveToFirestore(user);
    });

    // Load form data from Firestore and populate fields
    await loadFormDataFromFirestore(user);

        // File selection
        printNameFileInput?.addEventListener('change', (event) => {
        printNameFile = event.target.files[0];
        console.log("Selected file:", printNameFile);
    });


    // Add event listeners to form fields to save data on change, input, blur, and focus
    const formFields = document.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('change', async () => {
            await saveFormDataToFirestore(user);
        });
    });

    formFields.forEach(field => {
        field.addEventListener('input', async () => {
            await saveFormDataToFirestore(user);
        });
    });

    formFields.forEach(field => {
        field.addEventListener('blur', async () => {
            await saveFormDataToFirestore(user);
        });
    });

    formFields.forEach(field => {
        field.addEventListener('focus', async () => {
            await saveFormDataToFirestore(user);
        });
    });

    // Handle back button click
    backButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await saveFormDataToFirestore(user);
        window.location.href = "form_page10.html";
    });

    //Handle success modal
    document.getElementById('toDashboard').addEventListener('click', () => {
        // Handle status to "Submitted"
        handleStatus('Submitted');  // This will call the function with the status 'Submitted'
    
        // Redirect to the dashboard
        window.location.href = "applicant_dashboard.html";
    });

    // Handle "Continue" button click
    continueButton.addEventListener('click', async (event) => {
        event.preventDefault();
        
        // Save the form data to Firestore
        await saveFormDataToFirestore(user);
    
        // Update the status to "submitted"
        const formDocRef = doc(db, "users", user.uid, "forms", "form11");
        await updateDoc(formDocRef, {
            status: "Submitted"  // This updates the form status to "submitted"
        })

        // Show success modal
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'block';
        }
    });
  });
});
