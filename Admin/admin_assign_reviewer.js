import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collectionGroup, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

async function fetchApplicants() {
  try {
    const formsSnapshot = await getDocs(collectionGroup(db, "forms"));
    const tableBody = document.querySelector("#assign-reviewer tbody");
    tableBody.innerHTML = "";

    const seenUIDs = new Set();

    formsSnapshot.forEach((formDoc) => {
      const uid = formDoc.ref.parent.parent.id;

      if (!seenUIDs.has(uid)) {
        seenUIDs.add(uid);

        const data = formDoc.data();
        const fullName = `${(data.givenName || '').toUpperCase()} ${(data.familyName || '').toUpperCase()}`.trim();
        const courseCode = data.courseCode || 'N/A';
        const courseTitle = (data.courseTitle || 'N/A').toUpperCase();
        const program = `${courseCode} - ${courseTitle}`;
        const status = data.status || 'N/A';

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${uid}</td>
          <td>${fullName || 'N/A'}</td>
          <td>${program}</td>
          <td>${status}</td>
          <td><button class="btn btn-sm btn-outline-secondary">Assign Reviewer</button></td>
        `;
        tableBody.appendChild(row);
      }
    });

    const assignButtons = document.querySelectorAll('.btn-outline-secondary');
    assignButtons.forEach(button => {
      button.addEventListener('click', function () {
        const uid = this.getAttribute('data-uid'); // Get the UID of the user
        window.location.href = `assign_reviewer.html?uid=${uid}`; // Redirect to assign_reviewer.html with UID as query parameter
      });
    });

  } catch (err) {
    console.error("Error fetching applicants: ", err);
  }
}

document.addEventListener("DOMContentLoaded", fetchApplicants);