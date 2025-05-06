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
        const status = 'Waitlist'; // default to Waitlist

        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${uid}</td>
          <td>${fullName || 'N/A'}</td>
          <td>${program}</td>
          <td>
            <select class="form-select form-select-sm status-select" data-uid="${uid}">
              <option value="Approve" ${status === "Approve" ? "selected" : ""}>Approve</option>
              <option value="Reject" ${status === "Reject" ? "selected" : ""}>Reject</option>
              <option value="Waitlist" ${status === "Waitlist" ? "selected" : ""}>Waitlist</option>
            </select>
          </td>
          <td class="assign-column">
            ${status === "Approve" ? `<button class="btn btn-sm btn-outline-secondary" data-uid="${uid}">Assign Reviewer</button>` : ""}
          </td>
        `;

        tableBody.appendChild(row);
      }
    });

    // Add event listeners for dropdown changes
    document.querySelectorAll(".status-select").forEach((select) => {
      select.addEventListener("change", function () {
        const newStatus = this.value;
        const row = this.closest("tr");
        const uid = this.getAttribute("data-uid");
        const assignColumn = row.querySelector(".assign-column");

        if (newStatus === "Approve") {
          assignColumn.innerHTML = `<button class="btn btn-sm btn-outline-secondary" data-uid="${uid}">Assign Reviewer</button>`;
        } else {
          assignColumn.innerHTML = "";
        }

        // Optionally: update Firestore with the new status here
      });
    });

  } catch (err) {
    console.error("Error fetching applicants: ", err);
  }
}

document.addEventListener("DOMContentLoaded", fetchApplicants);
