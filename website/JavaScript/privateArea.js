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

console.log("hello test");
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
        let timestamp = formatDate(Date.now()); // Get current timestamp //Lena
        console.log("1:"+timestamp);

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

let button2 = document.querySelector(".button2"); //stop button
button2.addEventListener("click", () => {
    button2.classList.add("active");
    
    // Fetch the last timestamp from Firebase
    firebase.database().ref('/users/'+email+'/walk').orderByKey().limitToLast(1).once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var timestamp = formatTime(Date.now());//childSnapshot.key; //Lena
            var angleDetailsRef = firebase.database().ref('/users/'+email+'/walk/' + timestamp + '/angleDetails');
            var timestampRef = firebase.database().ref('/users/'+email+'/walk/' + timestamp + '/time');
            
            // Retrieve the last angle value from Firebase
            database.ref('angle').once('value').then(function(snapshot) {
                var angleValue = snapshot.val();
                let CurrTimeStamp = formatTime(Date.now()); // Get current timestamp //Lena
                
                // Update the angleDetails with the retrieved angle value
                timestampRef.set(CurrTimeStamp);
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


// convert to date
function formatDate(milliseconds) {
    // Create a new Date object with the provided milliseconds
    const date = new Date(milliseconds);
    
    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const millisecondsFormatted = String(date.getMilliseconds()).padStart(3, '0');

    // Construct the formatted date string
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;

    return formattedDate;
}
-
// convert to date
function formatTime(milliseconds) {
    // Create a new Date object with the provided milliseconds
    const date = new Date(milliseconds);
    
    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const millisecondsFormatted = String(date.getMilliseconds()).padStart(3, '0');

    // Construct the formatted date string
    const formattedDate = `${hours}:${minutes}:${seconds}:${millisecondsFormatted}`;

    return formattedDate;
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
// Assume firebaseConfig is initialized earlier in the file
// Initialize Firebase
// Function to fetch and display history data
console.log(emailRef);
function fetchHistoryData(email) {
    const database = firebase.database(); // Initialize Firebase database
    // Normalize email to use as a database key
    const normalizedEmail = email.replace('.', '_');
    const userWalksRef = database.ref('users/' + normalizedEmail + '/walk');
    userWalksRef.once('value', (snapshot) => {
        const walks = snapshot.val();
        const tableBody = document.getElementById('usersTable').querySelector('tbody');

        // Clear existing table data
        tableBody.innerHTML = '';

        // Loop through each walk entry and add a row to the table
        for (const key in walks) {
            if (walks.hasOwnProperty(key)) {
                const walkEntry = walks[key];
                const row = tableBody.insertRow();
                
                const angleCell = row.insertCell(0);
                const timeCell = row.insertCell(1);
                
                angleCell.textContent = walkEntry.angleDetails;
                timeCell.textContent =  formatTime(Date.now()); //new Date(parseInt(walkEntry.time)).toLocaleString(); //Lena
            }
        }
    }).catch((error) => {
        console.error('Error fetching history data:', error);
    });
}
fetchHistoryData(emailRef);


