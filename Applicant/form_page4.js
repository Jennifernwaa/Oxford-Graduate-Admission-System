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

let langFile = null;
const langFileInput = document.getElementById('langFile');
const uploadLangFileBtn = document.getElementById('uploadLangFileBtn');

async function uploadLangFileAndSaveToFirestore(user) {
    if (!langFile) {
        alert("Please choose a PDF file before uploading.");
        return;
    }

    if (!user) {
        alert("User not authenticated.");
        return;
    }

    try {
        const storageRef = ref(storage, `users/${user.uid}/${langFile.name}`);
        const snapshot = await uploadBytes(storageRef, langFile);
        console.log("Upload successful:", snapshot);

        const downloadURL = await getDownloadURL(storageRef);
        console.log("Download URL:", downloadURL);

        // Save file URL to Firestore under form4
        const docRef = doc(db, "users", user.uid, "forms", "form4");
        await setDoc(docRef, {
            languageTestFileURL: downloadURL
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
    GRETestDate: document.getElementById("GRETestDate").value,
    verbalPercent: document.getElementById("verbalPercent").value,
    verbalScore: document.getElementById("verbalScore").value,
    quantitativePercent: document.getElementById("quantitativePercent").value,
    quantitativeScore: document.getElementById("quantitativeScore").value,
    analyticalWritingPercent: document.getElementById("analyticalWritingPercent").value,
    analyticalWritingScore: document.getElementById("analyticalWritingScore").value,
    
    englishFirstLanguage: document.querySelector('input[name="englishFirstLanguage"]:checked')?.value || "",
    ukDegreeInEnglish: document.querySelector('input[name="ukDegreeInEnglish"]:checked')?.value || "",
    tier4ChildVisa: document.querySelector('input[name="tier4ChildVisa"]:checked')?.value || "",

    testType: document.getElementById("testType").value,
    dateTaken: document.getElementById("dateTaken").value,
    overallResult: document.getElementById("overallResult").value,
    listeningScore: document.getElementById("listeningScore").value,
    readingScore: document.getElementById("readingScore").value,
    writingScore: document.getElementById("writingScore").value,
    speakingScore: document.getElementById("speakingScore").value,

    waiver: document.querySelector('input[name="waiver"]:checked')?.value || "",

    languageName: document.getElementById("languageName").value,
    languageReading: document.getElementById("languageReading").value,
    languageWriting: document.getElementById("languageWriting").value,
    languageSpeaking: document.getElementById("languageSpeaking").value,
    languageUnderstanding: document.getElementById("languageUnderstanding").value
    };
}

// Function to save form data to Firestore
async function saveFormDataToFirestore(user) {
    const formData = getFormData();
        try {
            const docRef = doc(db, "users", user.uid, "forms", "form4");
            await setDoc(docRef, { formPage4Data: formData }, { merge: true });
            console.log("Form data saved to Firestore.");
        } catch (error) {
            console.error("Error saving form data to Firestore:", error);
        }
}

// Function to load form data from Firestore
async function loadFormDataFromFirestore(user) {
    try {
            const docRef = doc(db, "users", user.uid, "forms", "form4");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const formData = docSnap.data().formPage4Data || {};
                const fileURL = docSnap.data().languageTestFileURL;

            // If file URL exists, create and insert link
            if (fileURL) {
                const fileLink = document.createElement('a');
                fileLink.href = fileURL;
                fileLink.textContent = "View previously uploaded file";
                fileLink.target = "_blank";
                document.body.appendChild(fileLink); // Or append to a specific div
            }
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
      if (radioGroup.length > 0) {
        radioGroup.forEach(radio => {
          radio.checked = (radio.value === value);
        });
        return;
      }
  
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

    uploadLangFileBtn?.addEventListener('click', async () => {
        await uploadLangFileAndSaveToFirestore(user);
    });
    

    // Load form data from Firestore and populate fields
    await loadFormDataFromFirestore(user);

    // File selection
    langFileInput?.addEventListener('change', (event) => {
        langFile = event.target.files[0];
        console.log("Selected file:", langFile);
    });


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
        window.location.href = "form_page3.html";
    });

    // Handle continue button click
    continueButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await saveFormDataToFirestore(user);
        window.location.href = "form_page5.html";
    });
    });
});
