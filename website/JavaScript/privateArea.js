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
firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', function () {
    // Check if Firebase has been initialized
    if (!firebase.apps.length) {
        firebase.initializeApp({
            apiKey: "AIzaSyCVEjwukELHMRqnj6yjIvmQcDVdPtR5zD4",
            authDomain: "",
            projectId: "finalproj155",
            storageBucket: "",
            messagingSenderId: "",
            appId: "",
            measurementId: ""
        });
    }


    // Check if the user is authenticated
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location.href = 'login.html'; // Redirect to login page if not authenticated
        } 
    });
});

// Define variables
const userId = ""; // Placeholder for user ID
currentUser = ""; // Placeholder for current user
window.addEventListener("load", () => {
    user = JSON.parse(localStorage.getItem("User")); // Retrieve user from localStorage
    currentUser = JSON.parse(localStorage.getItem("currentUser")); // Retrieve current user from localStorage
    console.log(currentUser); // Log current user to console
});

const app = firebase.initializeApp(firebaseConfig); // Initialize Firebase app
const database = firebase.database(); // Initialize Firebase database
const currUser = JSON.parse(localStorage.getItem("currentUser")); // Retrieve current user from localStorage
const email = currUser.email.replace(".", "_"); // Replace '.' in email for use as key

// Reference to the user's email node
const userRef = database.ref('users/');
const emailRef = database.ref('users/' + email);

// Function to trigger start and stop walk
function sendCurrentStateOfIsStart(start) {
    database.ref('isStart').set(start); // Set 'isStart' value in Firebase
}
// Event listener for start walk button
let button1 = document.querySelector(".button1");
let angleDetails = 0;
button1.addEventListener("click", () => {
    // Retrieve angle value from Firebase
    firebase.database().ref('angle').once('value').then(function(snapshot) {
        var angleValue = snapshot.val();
        var angleType = typeof angleValue; // Determine the type of the value
        
        button1.classList.add("active");
        var user = firebase.auth().currentUser;
        let timestamp = getCurrentTimeMillis(); // Get current timestamp
        console.log(timestamp);

        // Set data in Firebase
        firebase.database().ref('/users/'+email+'/walk/' + timestamp).set({
            time: timestamp,
            angleDetails: angleValue // Set angleDetails with retrieved angle value
        });
        sendCurrentStateOfIsStart(1); // Trigger start in Firebase
    }).catch(function(error) {
        console.error("Error retrieving angle value:", error);
    });
});

let button2 = document.querySelector(".button2");
button2.addEventListener("click", () => {
    button2.classList.add("active");
    
    // Fetch the last timestamp from Firebase
    firebase.database().ref('/users/'+email+'/walk').orderByKey().limitToLast(1).once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var timestamp = childSnapshot.key;
            var angleDetailsRef = firebase.database().ref('/users/'+email+'/walk/' + timestamp + '/angleDetails');
            
            // Retrieve the last angle value from Firebase
            database.ref('angle').once('value').then(function(snapshot) {
                var angleValue = snapshot.val();
                
                // Update the angleDetails with the retrieved angle value
                angleDetailsRef.set(angleValue);
                
                // Log the retrieved angle value
                console.log("Retrieved angle value:", angleValue);
            }).catch(function(error) {
                console.error("Error retrieving angle value:", error);
            });
            
            // Log the current timestamp
            console.log("Current timestamp:", timestamp);
        });
    }).catch(function(error) {
        console.error("Error retrieving last timestamp:", error);
    });

    sendCurrentStateOfIsStart(0); // Trigger start in Firebase
});







function getCurrentTimeMillis() {
    return Date.now(); // Get current timestamp in milliseconds
}






// Function for user logout
function logout() {
    var user = firebase.auth().currentUser;
    if (user) {
        // Delayed logout to ensure Firebase actions are completed
        setTimeout(() => {
            const userId = user.uid;
            firebase.auth().signOut().then(() => {
                firebase.database().ref('sessions/' + userId).update({ status: 'inactive' });
                localStorage.removeItem("currentUser"); // Cleanup local storage
                alert("Logged Out Successfully!"); // Alert user about successful logout
                window.location.href = "login.html"; // Redirect to login page
            }).catch((error) => {
                console.error('Logout Failed:', error);
            });
        }, 2000); // Delay in milliseconds (2000 ms = 2 seconds)
    } else {
        console.error('No user signed in to log out.');
    }
}

// Function to update welcome message with user's full name
function updateWelcomeMessage(fullName) {
    const h1 = document.querySelector('#welcomeMessage');
    h1.textContent = `Welcome ${fullName} to your private area`; // Set welcome message with user's full name
}


/////////////////////////////////////////////////////////////////////
//////////////////        Watch my history              /////////////
/////////////////////////////////////////////////////////////////////


// When the DOM content is loaded, this function is executed
document.addEventListener('DOMContentLoaded', function () {

    // User authentication check
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location.href = 'login.html'; // Redirect to login page if not authenticated
        }
    });

    // Prepare to interact with the Firebase Database
    const currUser = JSON.parse(localStorage.getItem("currentUser")); // Retrieve current user data from local storage
    const email = currUser.email.replace(".", "_"); // Replace '.' with '_' in email for Firebase path
    const table = document.getElementById('usersTable'); // Get the table element
    const tbody = document.createElement('tbody'); // Create tbody element to hold table rows
    table.appendChild(tbody); // Append tbody to the table

    // Reference to a user's walk data in Firebase Database
    const dbRef = firebase.database().ref('/users/' + email + '/walk/');
    const dbCurrentAngle = firebase.database().ref('angle');
    console.log(dbCurrentAngle);
    firebase.database().ref('/users/'+email+'/walk/' + timestamp).set({
            angleDetails: angle
    });
    // Event listener for any changes in the Firebase database data
    dbRef.on('value', function (snapshot) {

        tbody.innerHTML = ''; // Clear existing table data before adding new

        // Iterate through each child snapshot of the database reference
        snapshot.forEach(function (childSnapshot) {
            const data = childSnapshot.val(); // Retrieve the data of the child snapshot
            const row = document.createElement('tr'); // Create a new row element for the table

            // Create a cell for angle details and set its content to data.angleDetails
            const angleCell = document.createElement('td');
            angleCell.textContent = data.angleDetails;

            // Create a cell for date and set its content to formatted timestamp
            const dateCell = document.createElement('td');
            dateCell.textContent = new Date(data.time).toLocaleString();

            // Append angle cell and date cell to the row
            row.appendChild(angleCell);
            row.appendChild(dateCell);

            // Append the row to the tbody
            tbody.appendChild(row);
        });
    });
});

