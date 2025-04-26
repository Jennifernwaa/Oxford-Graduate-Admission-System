// Import Firebase modules (ensure consistent versions)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collectionGroup, collection, doc, getDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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
    if (!timestamp) return 'N/A';
    
    const date = timestamp instanceof Date ? timestamp : 
                 timestamp.toDate ? timestamp.toDate() : 
                 new Date(timestamp);
                 
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options); // Format as "April 25 2025"
}

// Function to fetch all applications from Firestore
async function fetchApplications() {
    try {
        // Ensure the user is authenticated
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Query all "forms" subcollections across all users
                const formsQuery = query(collectionGroup(db, "forms"));
                const formsSnap = await getDocs(formsQuery);
                
                const applications = {
                    assigned: [],
                    pending: [],
                    completed: []
                };

                formsSnap.forEach((formDoc) => {
                    if (formDoc.exists()) {
                        const formData = formDoc.data();
                        const userId = formDoc.ref.parent.parent.id; // Get the user ID from the parent document
                        
                        const application = {
                            givenName: formData.givenName || '',
                            familyName: formData.familyName || '',
                            courseCode: formData.courseCode || '',
                            courseTitle: formData.courseTitle || '',
                            userId: userId,
                            formId: formDoc.id,
                            submittedAt: formData.submittedAt ? formatDate(formData.submittedAt) : 'N/A',
                            status: formData.status || 'Pending',
                        };

                        // Skip empty records
                        if (!application.givenName && !application.familyName) {
                            return; // Skip further processing for this application
                        }

                        // Categorize the applications
                        if (formData.reviewedAt) {
                            applications.completed.push(application);
                        } else if (formData.status === 'Pending' || formData.status === 'Additional Documents Requested') {
                            applications.pending.push(application);
                        } else {
                            applications.assigned.push(application);
                        }
                    }
                });

                // Display applications in their respective tables
                displayApplications('assignedApplications', applications.assigned);
                displayApplications('pendingReviews', applications.pending);
                displayApplications('completedReviews', applications.completed);
                
            } else {
                console.error("User is not authenticated.");
            }
        });
    } catch (error) {
        console.error("Error fetching applications: ", error);
    }
}

// Function to display applications in the tables
function displayApplications(tableId, applications) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = ''; // Clear existing rows
    
    if (applications.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" class="text-center">No applications found</td>`;
        tableBody.appendChild(row);
        return;
    }

    for (const app of applications) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${app.givenName} ${app.familyName}</td>
            <td>${app.courseCode || 'N/A'}</td>
            <td>${app.courseTitle || 'N/A'}</td>
            <td>${app.submittedAt}</td>
            <td><span class="badge ${getBadgeClass(app.status)}">${app.status}</span></td>
            <td>
                <a href="review_applicant_page.html?uid=${app.userId}&formId=${app.formId}" 
                   class="btn btn-sm btn-outline-secondary">
                   ${app.status === 'Completed' ? 'View' : 'Review'}
                </a>
            </td>
        `;
        tableBody.appendChild(row);
    }
}

// Helper function to get appropriate badge class based on status
function getBadgeClass(status) {
    switch(status) {
        case 'Approved': return 'bg-success';
        case 'Rejected': return 'bg-danger';
        case 'Additional Documents Requested': return 'bg-warning text-dark';
        case 'Completed': return 'bg-info text-dark';
        default: return 'bg-secondary'; // Pending or any other status
    }
}

// Call fetchApplications when the page loads
document.addEventListener('DOMContentLoaded', fetchApplications);