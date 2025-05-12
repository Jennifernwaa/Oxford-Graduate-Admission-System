import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
    getFirestore,
    collectionGroup,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const totalEl = document.querySelector("#statistics .card-title:nth-child(1)");
const underReviewEl = document.querySelector("#statistics .col-md-6:nth-child(2) .card-title");
const acceptedEl = document.querySelector("#statistics .col-md-6:nth-child(3) .card-title");
const rejectedEl = document.querySelector("#statistics .col-md-6:nth-child(4) .card-title");

async function calculateStatistics() {
    let total = 0;
    let underReview = 0;
    let accepted = 0;
    let rejected = 0;

    const snapshot = await getDocs(collectionGroup(db, "forms"));

    snapshot.forEach(doc => {
        if (doc.id !== "form11") return; // ✅ Only count form11

        const data = doc.data();
        const status = data.status;

        if (!status) return;

        // Count total for relevant statuses
        if (["Submitted", "Waitlist", "Approve", "Reject", "Reviewed", "Additional Documents Requested", "Accepted", "Rejected"].includes(status)) {
            total++;
        }

        // Count under review
        if (["Reviewed", "Additional Documents Requested"].includes(status)) {
            underReview++;
        }

        // Count accepted/rejected
        if (status === "Accepted") accepted++;
        if (status === "Rejected") rejected++;
    });

    // Update DOM
    if (totalEl) totalEl.textContent = total;
    if (underReviewEl) underReviewEl.textContent = underReview;
    if (acceptedEl) acceptedEl.textContent = accepted;
    if (rejectedEl) rejectedEl.textContent = rejected;
}

calculateStatistics();
