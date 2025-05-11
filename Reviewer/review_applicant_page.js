// Import Firebase modules (ensure consistent versions)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collectionGroup, collection, doc, getDoc, getDocs, query, where, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

// Function to format the date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options); // Format as "April 25 2025"
}

// Function to fetch the specific user form data from Firestore
async function fetchFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('uid');
  
    if (!userId) {
      console.error("Missing userId in URL.");
      return;
    }
  
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.error("User is not authenticated.");
        return;
      }
  
      try {
        let formData = {};
  
        // Loop through form1 to form11
        for (let i = 1; i <= 11; i++) {
            const formId = `form${i}`;
            const formSnap = await getDoc(doc(db, "users", userId, "forms", formId));
          
            if (formSnap.exists()) {
              const mergedInputs = formSnap.data();
          
              // Flatten any nested objects (e.g., formPage2Data)
              for (const key in mergedInputs) {
                const value = mergedInputs[key];
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                  formData = { ...formData, ...value }; // flatten nested object
                } else {
                  formData[key] = value; // preserve top-level keys
                }
              }
            }
          }
          
  
        console.log("Merged Form Data from form1 to form11:", formData);
        displayFormData(formData);
  
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    });
  }
  



// Function to display the form data in the HTML
function displayFormData(formData) {
    const formContainer = document.querySelector('table'); // Target the table to display user data
    formContainer.innerHTML = `
        <tr>
            <td><strong>Name:</strong></td>
            <td>${formData.givenName || 'N/A'} ${formData.familyName || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>Program Applied For:</strong></td>
            <td>${formData.courseTitle || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>Submission Date:</strong></td>
            <td>${formData.submittedAt ? formatDate(formData.submittedAt) : 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>Previous Institution:</strong></td>
            <td>${formData.education1University || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>Qualification & Major:</strong></td>
            <td>${formData.education1Qualification || 'N/A'} in ${formData.education1Subject || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>Grade:</strong></td>
            <td>${formData.education1Result || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>GRE Test Score:</strong></td>
            <td>Verbal: ${formData.verbalScore || 'N/A'}, Quantitative: ${formData.quantitativeScore || 'N/A'}, Analytical Writing: ${formData.analyticalWritingScore || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>English Language Proficiency:</strong></td>
            <td>${formData.testType || 'N/A'} (${formData.overallResult || 'N/A'})</td>
        </tr>
    `;

    // Pre-fill form values if review data exists
    if (formData.academicRating) {
        document.querySelector(`input[name="academic"][value="${formData.academicRating}"]`).checked = true;
    }
    if (formData.researchRating) {
        document.querySelector(`input[name="research"][value="${formData.researchRating}"]`).checked = true;
    }
    if (formData.lettersofRecommendationRating) {
        document.querySelector(`input[name="recommendation"][value="${formData.lettersofRecommendationRating}"]`).checked = true;
    }
    if (formData.motivationRating) {
        document.querySelector(`input[name="motivation"][value="${formData.motivationRating}"]`).checked = true;
    }
    if (formData.overallRating) {
        document.querySelector(`input[name="overall"][value="${formData.overallRating}"]`).checked = true;
    }
    if (formData.recommendationDecision) {
        document.querySelector(`input[name="recommendation"][value="${formData.recommendationDecision}"]`).checked = true;
    }
    if (formData.reviewComments) {
        document.querySelector('textarea').value = formData.reviewComments;
    }
}

// Function to handle the review process
async function handleReview(status) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('uid');
        const formId = urlParams.get('formId');

        if (!userId || !formId) {
            console.error("Missing userId or formId");
            return;
        }

        // Get form values
        const academicRating = document.querySelector('input[name="academic"]:checked')?.value || '';
        const researchRating = document.querySelector('input[name="research"]:checked')?.value || '';
        const lettersofRecommendationRating = document.querySelector('input[name="recommendation"]:checked')?.value || '';
        const motivationRating = document.querySelector('input[name="motivation"]:checked')?.value || '';
        const overallRating = document.querySelector('input[name="overall"]:checked')?.value || '';
        const reviewComments = document.querySelector('textarea').value || '';


        const formRef = doc(db, "users", userId, "forms", formId); // original form
        const reviewRef = doc(db, "reviewResponse", userId); // new review record

        // Prepare review data
        const reviewData = {
            status,
            academicRating,
            researchRating,
            lettersofRecommendationRating,
            motivationRating,
            overallRating,
            reviewComments,
            reviewedAt: new Date(),
            reviewedBy: auth.currentUser?.uid || 'Unknown Reviewer'
        };

        // Save to the user's form (original location)
        await updateDoc(formRef, reviewData);

        // Also save to the central reviewResponse collection
        await updateDoc(reviewRef, reviewData).catch(async (error) => {
            // If the document doesn't exist, create it
            if (error.code === "not-found") {
                await setDoc(reviewRef, reviewData);
            } else {
                throw error;
            }
        });

        alert(`Application ${status} successfully.`);
        window.location.href = "reviewer_dashboard.html";
    } catch (error) {
        console.error("Error saving review: ", error);
        alert("Error updating application status. Please try again.");
    }
}

// Call fetchFormData when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchFormData();
    
    // Add event listeners to the buttons
    document.querySelector('.btn-primary').addEventListener('click', (e) => {
        e.preventDefault();
        handleReview('Accepted');
    });
    
    document.querySelector('.btn-danger').addEventListener('click', (e) => {
        e.preventDefault();
        handleReview('Rejected');
    });
    
    document.querySelector('.btn-secondary').addEventListener('click', (e) => {
        e.preventDefault();
        handleReview('Additional Documents Requested');
    });
});