// תזין את הנתונים שלך ב-firebaseConfig
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
window.addEventListener("load" , ()=>{
    user = JSON.parse(localStorage.getItem("User"))
    currentUser = JSON.parse(localStorage.getItem("currentUser"))

   // console.log(user);
    console.log(currentUser);

});

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const currUser = JSON.parse(localStorage.getItem("currentUser"));
  const email = currUser.email.replace(".", "_");
  // Reference to the user's email node
  const userRef = database.ref('users/');
  const emailRef = database.ref('users/' + email);
  function CreateUserData(angle) {
      // Push a new child under 'trainNumber' with the trainDetails
      userRef.child(email).push({
        angleDetails: angle
      });
    }
function sendStartToFirebase(start){
    database.ref('isStart').set(start)
}
function sendStopToFirebase(stop){
    database.ref('isStart').set(stop)
}
let button1 = document.querySelector(".button1");
button1.addEventListener("click", () => {
    button1.classList.add("active");

    setTimeout(() => {
        button1.classList.remove("active");
    }, 6000); // 6 seconds

sendStartToFirebase(1);
});


let button2 = document.querySelector(".button2");
button2.addEventListener("click", () => {
    button2.classList.add("active");

    setTimeout(() => {
        button2.classList.remove("active");

        sendStopToFirebase(0);
        CreateUserData(1);
        window.location.href = 'watchHistory.html';
    }, 6000); // 6 seconds

    
});


let button3 = document.querySelector(".button3");
button3.addEventListener("click", () => {
    button3.classList.add("active");

    setTimeout(() => {
        button3.classList.remove("active");
        window.location.href = 'watchHistory.html';
    }, 6000); // 6 seconds
});





// LOGOUT BUTTON

// Check if the user is logged in
/*window.addEventListener("load", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const privateLink = document.querySelector('.private-link');
    const menuContainer = document.querySelector('.menu-container');

    if (currentUser) {
        // If the user is logged in, show the logout button
        const logoutButton = document.createElement('button');
        logoutButton.classList.add('menu-item');
        logoutButton.innerText = 'Logout';
        logoutButton.addEventListener('click', logout);
        menuContainer.appendChild(logoutButton);
    } else {
        // If the user is not logged in, show a message
        const message = document.createElement('span');
        message.innerText = 'Not connected to your account';
        message.style.padding = '10px';
        menuContainer.appendChild(message);
    }

    // Show the menu when hovering over the private link
    privateLink.addEventListener('mouseover', () => {
        menuContainer.style.display = 'block';
    });

    // Hide the menu when not hovering over the private link
    privateLink.addEventListener('mouseout', () => {
        menuContainer.style.display = 'none';
    });
});

function logout() {
    // Clear the current user from localStorage
    localStorage.removeItem('currentUser');
    alert('Successfully logged out!');
    // Redirect to the login page or any other appropriate page
    window.location.href = 'login.html';

    // Function to handle logout button click
    // For example, clear session variables or revoke tokens
    sessionStorage.setItem('loggedIn', 'false');
    // Redirect the user to the logout page or perform other necessary actions
    alert('Logout clicked');
    updateUI();
}
*/
function checkLogin() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        window.location.href = "/html/private area.html"; // Redirect to the private area
      } else {
        // No user is signed in.
        alert("You need to log in to access the private area.");
        window.location.href = "login.html"; // Redirect to the login page
      }
    });
  }

  var logoutBtn = document.getElementById('logoutBtn');

// Add event listener to logout button
logoutBtn.addEventListener('click', function() {
    // Call the logout function
    logout();
});

// Function to handle logout
function logout() {
    firebase.auth().signOut()
        .then(function() {
            // Sign-out successful
            console.log("User signed out successfully");
            // Redirect to the login page or perform any other action
            window.location.href = "HomePage.html";
        })
        .catch(function(error) {
            // An error happened
            console.error("Error signing out:", error);
            // Optionally display an error message to the user
        });
}

