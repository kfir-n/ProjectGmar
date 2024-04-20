let LoggedIn = false;

const firebaseConfig = {
    apiKey: "AIzaSyCVEjwukELHMRqnj6yjIvmQcDVdPtR5zD4",
    authDomain: "",
    projectId: "finalproj155",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

currentUser = ""
window.addEventListener("load", () => {
  user = JSON.parse(localStorage.getItem("User"))
  currentUser = JSON.parse(localStorage.getItem("currentUser"))
  // console.log(user);
  console.log(currentUser);

});
const app = firebase.initializeApp(firebaseConfig);   //התחברות לפרויקט בשרת
const database = firebase.database();


fdocument.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Stop the form from submitting normally
    login(); // Call your login function
});

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userId = user.uid;
            const loginTime = Date.now();
            const sessionInfo = { loginTime, status: 'active' };
            firebase.database().ref('sessions/' + userId).set(sessionInfo); // Create session in database
            localStorage.setItem("currentUser", JSON.stringify(user));
            alert("Successful Login!");
            window.location.href = "private area.html";
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}


function checkLogin() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const emailFormatted = user.email.replace(/\./g, ',');
            sessionStorage.setItem("email", emailFormatted);
            displayUserFullName(emailFormatted); // Optionally display the user's name
            window.location.href = "private area.html"; // Redirect to private area if on login page and user is logged in
        } else {
            // No user is signed in.
            if (window.location.pathname !== "/path/to/login.html") { // Change to your actual login page path
                window.location.href = "login.html"; // Only redirect if not already on login page
            }
        }
    });
}

window.addEventListener('load',checkLogin);
// איתחול Firebase כבר נעשה ב-HTML שלך, אז אין צורך לחזור על זה.

// איתחול Firebase נעשה בקובץ ה-HTML, אז ניתן להשתמש ישר ב-API של Firebase.

function displayUserFullName() {
    const emailFormatted = sessionStorage.getItem("email"); // שליפת האימייל מה-sessionStorage

    if (emailFormatted) {
        // קבלת הפנייה לנתוני המשתמש במסד הנתונים על פי האימייל
        const userRef = firebase.database().ref('users/' + emailFormatted);
        userRef.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                // עדכון ה-h1 באזור המוגן
                document.querySelector('body h1').textContent = `Welcome to your private area, ${userRef}`;
            } else {
                console.error('Could not find user data in the database.');
            }
        }).catch((error) => {
            console.error('Error reading from the database:', error);
        });
    } else {
        window.location.href = 'login.html';
    }
}

// קריאה לפונקציה כשהעמוד נטען
window.addEventListener('load', displayUserFullName);

  
  // שומרת מספר מזהה של המשתמש
  function handleSession(user) {
    const userId = user.uid;
    const loginTime = Date.now();
    const sessionInfo = { loginTime, status: 'active' };
  
    // שמירת מידע מושב במסד הנתונים
    firebase.database().ref('sessions/' + userId).set(sessionInfo);
  }

  
  
