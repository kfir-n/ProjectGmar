// תזין את הנתונים שלך ב-firebaseConfig
const firebaseConfig = {
  apiKey: "AIzaSyCVEjwukELHMRqnj6yjIvmQcDVdPtR5zD4",
  authDomain: "",
  projectId: "finalproj155",
  databaseURL: "https://finalproj155-default-rtdb.firebaseio.com/",
  storageBucket: "",
  messagingSenderId: "498844428369",
  appId: "",
  measurementId: ""
};
currentUser = ""; // Variable to hold the current user
window.addEventListener("load", () => {
  user = JSON.parse(localStorage.getItem("User")); // Read user from localStorage
  currentUser = JSON.parse(localStorage.getItem("currentUser")); // Read current user from localStorage
  console.log(currentUser); // Log the current user to console
});
const app = firebase.initializeApp(firebaseConfig); // Connect to the project on the Firebase server
const database = firebase.database(); // Database reference
// Function to save a new user to the database
function saveUserOnDB() {
   var email = document.getElementById("em").value; // Read email from the input
   var password = document.getElementById("pass").value; // Read password from the input
   var fullName = document.getElementById("name").value; // Read full name from the input
    
    var auth = firebase.auth(); // Authentication object
    auth.createUserWithEmailAndPassword(email, password) // Create user in Firebase Authentication
      .then((userCredential) => {
        var user = userCredential.user; // Get the created user
        localStorage.setItem("User", JSON.stringify(user)); // Store the user in localStorage
         alert("Successful registration!"); // Alert the user about successful registration
          email_a=email.replace(".", "_"); // Encode the email for use as a key
         firebase.database().ref('users/' + email_a).set({ // Save the user to the database
          email: email,
          fullName: fullName
        }).then(() => { // If successful
          console.log('User data saved to Realtime Database successfully!');
          window.location.href = "login.html"; // Redirect to login page after successful registration
        }).catch((error) => { // If failed
          console.error('Failed to save user data to Realtime Database:', error);
        });
  
      })
      .catch((error) => {
        var errorCode = error.code; // Error code
        var errorMessage = error.message; // Error message
        console.log(errorMessage); // Log the error message to console
        alert("Error: " + errorMessage); // Alert the user about the error
      });
  }

// Function for user login
function login() {
  email = document.getElementById("email").value; // Read email from the input
  password = document.getElementById("password").value; // Read password from the input

  // Sign in with email and password
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user; // Get the signed-in user
      localStorage.setItem("currentUser", JSON.stringify(user)); // Store the current user in localStorage
      alert("Successful Login!"); // Alert the user about successful login
      window.location.href = "private area.html"; // Redirect to private area after successful login
    })
    .catch((error) => {
      var errorMessage = error.message; // Error message
      console.log(errorMessage); // Log the error message to console
      alert("Error: " + errorMessage); // Alert the user about the error
    });
}
function readAndDisplayUsers() {
  var usersRef = database.ref('users');
  usersRef.on('value', function(snapshot) {
      var users = snapshot.val();
      var usersTableBody = document.getElementById("usersTable").getElementsByTagName('tbody')[0];
      usersTableBody.innerHTML = ""; // ניקוי הטבלה לפני הוספת נתונים חדשים
      for (var userId in users) {
          var row = usersTableBody.insertRow(-1); // הוספת שורה לטבלה
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          cell1.textContent = users[userId].username; // או כל שדה אחר שברצונך להציג
          cell2.textContent = users[userId].email; // או כל שדה אחר שברצונך להציג
      }
  });
}

