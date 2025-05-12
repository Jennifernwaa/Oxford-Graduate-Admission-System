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
        const urlParams = new URLSearchParams(window.location.search);
        this.userId = urlParams.get('uid');

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
        const urlParams = new URLSearchParams(window.location.search);
        this.userId = urlParams.get('uid');
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

        // Pre-fill form values if review data exists
    if (this.formData.academicRating) {
        document.querySelector(`input[name="academic"][value="${this.formData.academicRating}"]`).checked = true;
    }
    if (this.formData.researchRating) {
        document.querySelector(`input[name="research"][value="${this.formData.researchRating}"]`).checked = true;
    }
    if (this.formData.lettersofRecommendationRating) {
        document.querySelector(`input[name="recommendation"][value="${this.formData.lettersofRecommendationRating}"]`).checked = true;
    }
    if (this.formData.motivationRating) {
        document.querySelector(`input[name="motivation"][value="${this.formData.motivationRating}"]`).checked = true;
    }
    if (this.formData.overallRating) {
        document.querySelector(`input[name="overall"][value="${this.formData.overallRating}"]`).checked = true;
    }
    if (this.formData.reviewComments) {
        document.querySelector('textarea').value = this.formData.reviewComments;
    }
    }

    // Handle the review process
    async handleReview(status) {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const formId = urlParams.get('formId');
            this.userId = urlParams.get('uid');

            if (!this.userId || !formId) {
                console.error("Missing userId or formId");
                return;
            }

                // Get Review values
                const academicRating = document.querySelector('input[name="academic"]:checked')?.value || '';
                const researchRating = document.querySelector('input[name="research"]:checked')?.value || '';
                const lettersofRecommendationRating = document.querySelector('input[name="recommendation"]:checked')?.value || '';
                const motivationRating = document.querySelector('input[name="motivation"]:checked')?.value || '';
                const overallRating = document.querySelector('input[name="overall"]:checked')?.value || '';
                const reviewComments = document.querySelector('textarea').value || '';

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
            const formRef = doc(db, "users", this.userId, "forms", formId);
            await updateDoc(formRef, reviewData);

            // ✅ Also update the status in the form11 document, if needed
            const form11DocRef = doc(db, "users", this.userId, "forms", "form11");
            await setDoc(form11DocRef, {
                status: reviewData.status // Save the status in the form11 document as well
            }, { merge: true });

            // Save to the central reviewResponse collection
            const reviewRef = doc(db, "reviewResponse", this.userId);
            await setDoc(reviewRef, reviewData).catch(async (error) => {
                if (error.code === "not-found") {
                    await setDoc(reviewRef, reviewData);
                } else {
                    throw error;
                }
            });


            // alert(`Application ${status} successfully.`);
            // window.location.href = "reviewer_dashboard.html";
        } catch (error) {
            console.error("Error saving review: ", error);
            alert("Error updating application status. Please try again.");
        }
    }

    // Function to send email via AJAX
    sendEmail(status) {
        const email = document.getElementById('applicantEmail').value;
        const fullName = document.getElementById('applicantName').value;
    
        if (!email || !fullName) {
            console.error("Email or full name is missing.");
            return;
        }
    
        const formData = new FormData();
        formData.append('applicantEmail', email);
        formData.append('applicantName', fullName);
        formData.append('statusField', status);
    
        fetch('review_applicant_page.php', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json()) // Parse JSON response
            .then((data) => {
                if (data.status === "success") {
                    console.log("Email sent successfully:", data.message);
                    window.location.href = "reviewer_dashboard.html"; // Redirect after success
                } else {
                    console.error("Email sending failed:", data.message);
                    window.location.href = "reviewer_dashboard.html"; // Redirect after success
                }
            })
            .catch((error) => {
                console.error("Error sending email:", error);
                window.location.href = "reviewer_dashboard.html"; // Redirect after success
            });
    }

    // Add event listeners to buttons
    addEventListeners() {
        document.getElementById('acceptButton').addEventListener('click', async (e) => {
            e.preventDefault();
            setStatus('Accepted'); // Set the status
            await this.handleReview('Accepted'); // Save the review
            this.sendEmail('Accepted'); // Send the email
        });
    
        document.getElementById('rejectButton').addEventListener('click', async (e) => {
            e.preventDefault();
            setStatus('Rejected'); // Set the status
            await this.handleReview('Rejected'); // Save the review
            this.sendEmail('Rejected'); // Send the email
        });
    
        document.getElementById('requestDocsButton').addEventListener('click', async (e) => {
            e.preventDefault();
            setStatus('Request Additional Documents'); // Set the status
            await this.handleReview('Additional Documents Requested'); // Save the review
            this.sendEmail('Request Additional Documents'); // Send the email
        });
    }

}





// Instantiate the class
new ReviewApplicantPage();