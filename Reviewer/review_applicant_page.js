// Import Firebase modules (ensure consistent versions)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCbSqQtKpBtfu6EqTCyk5uTNkFiEc7jejU",
    authDomain: "oxford-graduate-admission.firebaseapp.com",
    projectId: "oxford-graduate-admission",
    storageBucket: "oxford-graduate-admission.firebasestorage.app",
    messagingSenderId: "992593803011",
    appId: "1:992593803011:web:4c853113afb814b9c7db36",
    measurementId: "G-Y3YHM86E5Z",
    databaseURL: "https://oxford-graduate-admission-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

class ReviewApplicantPage {
    constructor() {
        this.userId = null;
        this.formData = {};
        this.init();
    }

    // Initialize the page
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.fetchFormData();
            this.addEventListeners();
        });
    }

    // Format date
    static formatDate(timestamp) {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    // Fetch form data from Firestore
    async fetchFormData() {
        const urlParams = new URLSearchParams(window.location.search);
        this.userId = urlParams.get('uid');

        if (!this.userId) {
            console.error("Missing userId in URL.");
            return;
        }

        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.error("User is not authenticated.");
                return;
            }

            try {
                this.formData = await this.getMergedFormData();
                await this.populateApplicantDetails();
                this.displayFormData();
            } catch (error) {
                console.error("Error fetching form data:", error);
            }
        });
    }

    // Merge form data from multiple forms
    async getMergedFormData() {

        let mergedData = {};

        for (let i = 1; i <= 11; i++) {
            const formId = `form${i}`;
            const formSnap = await getDoc(doc(db, "users", this.userId, "forms", formId));

            if (formSnap.exists()) {
                const formData = formSnap.data();
                // Flatten any nested objects (e.g., formPage2Data)
                for (const key in formData) {
                    const value = formData[key];
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        mergedData = { ...mergedData, ...value }; // flatten nested object
                    } else {
                        mergedData[key] = value; // preserve top-level keys
                    }
                  }
            }
            
        }

        return mergedData;
    }

    // Populate applicant details from Realtime Database
    async populateApplicantDetails() {
        const userRef = ref(database, `users/${this.userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const applicantEmail = userData.username;
            const applicantFullName = `${this.formData.givenName || ''} ${this.formData.familyName || ''}`;

            document.getElementById('applicantName').value = applicantFullName || 'N/A';
            document.getElementById('applicantEmail').value = applicantEmail || 'N/A';
            console.log("Applicant Name:", applicantFullName);
            console.log("Applicant Email:", applicantEmail);

        } else {
            console.error("No user data found.");
        }
    }

    // Display form data in the HTML
    displayFormData() {
        const formContainer = document.querySelector('table');
        formContainer.innerHTML = `
            <tr>
                <td><strong>Name:</strong></td>
                <td>${this.formData.givenName || 'N/A'} ${this.formData.familyName || 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>Program Applied For:</strong></td>
                <td>${this.formData.courseTitle || 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>Submission Date:</strong></td>
                <td>${this.formData.submittedAt ? ReviewApplicantPage.formatDate(this.formData.submittedAt) : 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>Previous Institution:</strong></td>
                <td>${this.formData.education1University || 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>Qualification & Major:</strong></td>
                <td>${this.formData.education1Qualification || 'N/A'} in ${this.formData.education1Subject || 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>Grade:</strong></td>
                <td>${this.formData.education1Result || 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>GRE Test Score:</strong></td>
                <td>Verbal: ${this.formData.verbalScore || 'N/A'}, Quantitative: ${this.formData.quantitativeScore || 'N/A'}, Analytical Writing: ${this.formData.analyticalWritingScore || 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>English Language Proficiency:</strong></td>
                <td>${this.formData.testType || 'N/A'} (${this.formData.overallResult || 'N/A'})</td>
            </tr>
        `;
    }

    // Handle the review process
    async handleReview(status) {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const formId = urlParams.get('formId');

            if (!this.userId || !formId) {
                console.error("Missing userId or formId");
                return;
            }

            const reviewData = this.getReviewData(status);

            // Save to the user's form (original location)
            const formRef = doc(db, "users", this.userId, "forms", formId);
            await updateDoc(formRef, reviewData);

            // Save to the central reviewResponse collection
            const reviewRef = doc(db, "reviewResponse", this.userId);
            await updateDoc(reviewRef, reviewData).catch(async (error) => {
                if (error.code === "not-found") {
                    await setDoc(reviewRef, reviewData);
                } else {
                    throw error;
                }
            });

            // alert(`Application ${status} successfully.`);
            window.location.href = "reviewer_dashboard.html";
        } catch (error) {
            console.error("Error saving review: ", error);
            alert("Error updating application status. Please try again.");
        }
    }

    // Get review data from the form
    getReviewData(status) {
        return {
            status,
            academicRating: document.querySelector('input[name="academic"]:checked')?.value || '',
            researchRating: document.querySelector('input[name="research"]:checked')?.value || '',
            lettersofRecommendationRating: document.querySelector('input[name="recommendation"]:checked')?.value || '',
            motivationRating: document.querySelector('input[name="motivation"]:checked')?.value || '',
            overallRating: document.querySelector('input[name="overall"]:checked')?.value || '',
            reviewComments: document.querySelector('textarea').value || '',
            reviewedAt: new Date(),
            reviewedBy: auth.currentUser?.uid || 'Unknown Reviewer'
        };
    }

    // Add event listeners to buttons
    addEventListeners() {
        document.querySelector('.btn-primary').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleReview('Accepted');
        });

        document.querySelector('.btn-danger').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleReview('Rejected');
        });

        document.querySelector('.btn-secondary').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleReview('Additional Documents Requested');
        });
    }
}

// Instantiate the class
new ReviewApplicantPage();