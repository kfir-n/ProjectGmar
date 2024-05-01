 // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCVEjwukELHMRqnj6yjIvmQcDVdPtR5zD4",
        authDomain: "finalproj155.firebaseapp.com", 
        databaseURL: "https://finalproj155-default-rtdb.firebaseio.com/",
        projectId: "finalproj155",
        storageBucket: "finalproj155.appspot.com",
    };


currentUser = ""; // Variable to store current user data

window.addEventListener("load", () => {
  user = JSON.parse(localStorage.getItem("User")); // Get user data from local storage
  currentUser = JSON.parse(localStorage.getItem("currentUser")); // Get current user data from local storage
  console.log(currentUser); // Log current user data
});

const app = firebase.initializeApp(firebaseConfig); // Initialize Firebase app
const database = firebase.database(); // Initialize Firebase database
let LoggedIn = false; // Variable to track user login status
// Add event listener to login form submit button
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    login(); // Call login function
});

// Function to login user with Firebase authentication
function login() {
    const email = document.getElementById("email").value; // Get email from input field
    const password = document.getElementById("password").value; // Get password from input field

    // Sign in user with email and password
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user; // Get user data
            const userId = user.uid; // Get unique user ID
            const loginTime = Date.now(); // Get current login time
            const sessionInfo = { loginTime, status:'active'}; // Create session info object
            firebase.database().ref('sessions/' + userId).set(sessionInfo); // Save session info in database
            localStorage.setItem("currentUser", JSON.stringify(user)); // Store current user data in local storage
            alert("Successful Login!"); // Show success message
            window.location.href = "privateArea.html"; // Redirect to private area after login
        })
        .catch((error) => {
            alert("Error: " + error.message); // Show error message if login fails
        });
}

// Function to check user login status
function checkLogin() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) { // If user is logged in
            const emailFormatted = user.email.replace(/\./g, ','); // Format email for database
            sessionStorage.setItem("email", emailFormatted); // Store email in session storage
            displayUserFullName(emailFormatted); // Display user's full name
            window.location.href = "private area.html"; // Redirect to private area if logged in
        } else { // If no user is signed in
            if (window.location.pathname !== "/path/to/login.html") { // Check if not on login page
                window.location.href = "login.html"; // Redirect to login page if not already there
            }
        }
    });
}

// Call checkLogin function when page loads
window.addEventListener('load', checkLogin);

// Function to display user's full name in private area
function displayUserFullName() {
    const emailFormatted = sessionStorage.getItem("email"); // Get email from session storage

    if (emailFormatted) { // If email is found
        const userRef = firebase.database().ref('users/' + emailFormatted); // Get reference to user data in database
        userRef.once('value', (snapshot) => { // Get user data from database
            if (snapshot.exists()) { // If user data exists
                const userData = snapshot.val(); // Get user data
                document.querySelector('body h1').textContent = `Welcome to your private area, ${userData.name}`; 
                // Update welcome message with user's name
            } else { // If user data does not exist
                console.error('Could not find user data in the database.'); // Log error message
            }
        }).catch((error) => { // Handle database read error
            console.error('Error reading from the database:', error); // Log error message
        });
    } else { // If email is not found
        window.location.href = 'login.html'; // Redirect to login page
    }
}

// Call displayUserFullName function when page loads
window.addEventListener('load', displayUserFullName);

// Function to handle user session
function handleSession(user) {
    const userId = user.uid; // Get unique user ID
    const loginTime = Date.now(); // Get current login time
    const sessionInfo = { loginTime, status: 'active' }; // Create session info object

    // Save session info in database under 'sessions' node with user ID as key
    firebase.database().ref('sessions/' + userId).set(sessionInfo);
}

