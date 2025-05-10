// Import Firebase modules (ensure consistent versions)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collectionGroup, collection, doc, getDoc, getDocs, query, where, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

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
const database = getDatabase(app);

let selectedUid = null;

// Fetch reviewers from Realtime Database
function fetchReviewer() {
  const usersRef = ref(database, "users");
  get(usersRef).then((snapshot) => {
    const reviewerSelect = document.getElementById('reviewer');
    reviewerSelect.innerHTML = '';

    let hasReviewer = false;

    if (snapshot.exists()) {
      const users = snapshot.val();

      for (const userId in users) {
        const user = users[userId];
        if (user.role === "Reviewer") {
          hasReviewer = true;
          const option = document.createElement('option');
          option.value = userId;
          option.textContent = user.email || user.username || "Unnamed Reviewer";
          reviewerSelect.appendChild(option);
        }
      }

      // If no reviewers are found, show the "Assign Reviewer" button
      if (!hasReviewer) {
        const assignButton = document.getElementById("assignReviewerButton");
        if (assignButton) {
          assignButton.style.display = 'block'; // Show the button
        }
      }
    } else {
      console.log("No users found.");
    }
  }).catch((error) => {
    console.error("Error fetching data: ", error);
  });
}

async function fetchApplicants() {
  try {
    const formsSnapshot = await getDocs(collectionGroup(db, "forms"));
    const tableBody = document.querySelector("#assign-reviewer tbody");
    tableBody.innerHTML = "";

    const seenUIDs = new Set();

    for (const formDoc of formsSnapshot.docs) {
      const data = formDoc.data();
      const status = data.status || "Waitlist";

      if (
        formDoc.id === "form11" &&
        ["Submitted", "Approve", "Reject", "Waitlist"].includes(status)
      ) {
        const uid = formDoc.ref.parent.parent.id;

        if (!seenUIDs.has(uid)) {
          seenUIDs.add(uid);

          let assignButtonHTML = "";
          if (status === "Approve") {
          // 🔄 Check if reviewer already assigned
          try {
            const userDoc = await getDoc(doc(db, "users", uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            const reviewerName = userData.assignedReviewerName;

            if (reviewerName) {
              assignButtonHTML = `<span class="text">Reviewer: ${reviewerName}</span>`;
            } else {
              assignButtonHTML = `
                <button class="btn btn-sm btn-outline-secondary assign-btn" data-bs-toggle="modal" data-bs-target="#assignReviewerModal" data-uid="${uid}">
                  Assign Reviewer
                </button>`;
            }
          } catch (err) {
            console.error("Error fetching reviewer info:", err);
          }
        }


          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${uid}</td>
            <td>
              <select class="form-select form-select-sm status-select" data-uid="${uid}">
                <option value="Waitlist" ${status === "Waitlist" ? "selected" : ""}>Waitlist</option>
                <option value="Approve" ${status === "Approve" ? "selected" : ""}>Approve</option>
                <option value="Reject" ${status === "Reject" ? "selected" : ""}>Reject</option>
              </select>
            </td>
            <td class="assign-column">${assignButtonHTML}</td>
          `;
          tableBody.appendChild(row);
        }
      }
    }

    // Handle dropdown status change
    document.querySelectorAll(".status-select").forEach((select) => {
      select.addEventListener("change", async function () {
        const uid = this.getAttribute("data-uid");
        selectedUid = uid;
        const newStatus = this.value;
        const row = this.closest("tr");
        const assignColumn = row.querySelector(".assign-column");

        if (newStatus === "Approve") {
          assignColumn.innerHTML = `  
            <button 
              class="btn btn-sm btn-outline-secondary assign-btn" 
              data-bs-toggle="modal" 
              data-bs-target="#assignReviewerModal" 
              data-uid="${uid}">
              Assign Reviewer
            </button>`;
        } else {
          assignColumn.innerHTML = "";
        }

        try {
          const formDocRef = doc(db, "users", uid, "forms", "form11");
          await updateDoc(formDocRef, { status: newStatus });
          console.log(`Status for UID ${uid} updated to ${newStatus}`);
        } catch (error) {
          console.error("Error updating status:", error);
        }
      });
    });

    // Handle "Assign Reviewer" button
    document.addEventListener("click", async (e) => {
      if (e.target && e.target.classList.contains("assign-btn")) {
        const uid = e.target.getAttribute("data-uid");
        selectedUid = uid;
        await saveFormDataToFirestore(uid);
      }
    });

    // Handle global "Continue" button
    const continueBtn = document.getElementById("continue");
    if (continueBtn) {
      continueBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (selectedUid) {
          await saveFormDataToFirestore(selectedUid);
        } else {
          console.warn("No applicant selected.");
        }
      });
    }

    async function saveFormDataToFirestore(uid) {
      const select = document.querySelector(`.status-select[data-uid="${uid}"]`);
      if (!select) return;

      const status = select.value;

      try {
        const docRef = doc(db, "users", uid, "forms", "form11");
        await setDoc(docRef, { status: status }, { merge: true });
        console.log(`Saved status "${status}" for UID ${uid}`);
      } catch (error) {
        console.error(`Error saving form data for UID ${uid}:`, error);
      }
    }

    // Fetch reviewers on page load
    fetchReviewer();

  } catch (err) {
    console.error("Error fetching applicants:", err);
  }
}

document.addEventListener("DOMContentLoaded", fetchApplicants);
