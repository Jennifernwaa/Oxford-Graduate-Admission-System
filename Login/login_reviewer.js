// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getDatabase(app);

// Submit button
const submit = document.getElementById('submit');
submit.addEventListener("click", function(event) {
  event.preventDefault();

  // Get input values
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;  // Get the UID of the signed-in user

      const dbRef = ref(db);
      // Lookup the user in the 'users' node by UID
      get(child(dbRef, `users/${uid}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const role = userData.role;
            console.log(`Role for UID ${uid}:`, role);  // Log role for debugging

            if (role === "Reviewer") {
              // Redirect to admin dashboard
              window.location.href = '../Reviewer/reviewer_dashboard.html';
            } else {
              alert("Access denied. You are not an Administrator.");
              auth.signOut();
            }
          } else {
            console.log("No user found with UID:", uid); // Log if user not found
            alert("No user found. Access denied.");
            auth.signOut();
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          alert("Error checking user role.");
        });
    })
    .catch((error) => {
      console.error("Login failed:", error);
      alert("Incorrect Email or Password");
    });
});
