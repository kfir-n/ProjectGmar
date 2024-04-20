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


    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {

            window.location.href = 'login.html';
        } 
    });
});
const userId = "";
currentUser = ""
window.addEventListener("load", () => {
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

// function that trigger start and stop walk.
function sendStartToFirebase(start) {
    database.ref('isStart').set(start)
}
function sendStopToFirebase(stop) {
    database.ref('isStart').set(stop)
}

function getCurrentTimeMillis() {
    return Date.now();
}


//start walk button
let button1 = document.querySelector(".button1");
let angleDetails = 0;
button1.addEventListener("click", () => {
    button1.classList.add("active");
    var user = firebase.auth().currentUser;
    let timestamp = getCurrentTimeMillis();
    console.log(timestamp);

    firebase.database().ref('/users/'+email+'/walk/' + timestamp).set({
        time:timestamp,
        angleDetails: 0
    });
    sendStartToFirebase(1);
});
    

//stop walk button
let button2 = document.querySelector(".button2");
sendStopToFirebase(0);


function logout() {
    var user = firebase.auth().currentUser;
    if (user) {
        setTimeout(() => {
            const userId = user.uid;
            firebase.auth().signOut().then(() => {
                firebase.database().ref('sessions/' + userId).update({ status: 'inactive' });
                localStorage.removeItem("currentUser"); // Cleanup local storage
                alert("Logged Out Successfully!");
                window.location.href = "login.html";
            }).catch((error) => {
                console.error('Logout Failed:', error);
            });
        }, 2000); // Delay in milliseconds (2000 ms = 2 seconds)
    } else {
        console.error('No user signed in to log out.');
    }
}

// ========================================================
// PRIVATE AREA JAVASCRIPT IN ORDER TO SHOW THE USERNAME
// ========================================================
document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.querySelector('.btn'); // Assuming '.btn' is your logout or other action button

    if (logoutButton) {
        logoutButton.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent from page to repload 1000 times
            logout(); // Call your logout function or any other function that needs to run
        });
    }

    const user = firebase.auth().currentUser;
    if (!user) {
        const normalizedEmail = email.replace('.', ','); // Firebase keys can't contain '.' characters

        // Define the path to fetch data from
        const path = '/users/' + normalizedEmail + '/fullName';
        
        userRef.once('value').then(function (snapshot) {
            if (snapshot.exists()) {
                // Only redirect if the user is definitely not logged in and you're not already on the login page
                if (window.location.pathname !== '/private area.html') {
                    window.location.href = 'private area.html';
                }
                const userData = snapshot.val();
                updateWelcomeMessage(userData.userId); // Assuming 'fullName' is the key where you store user's name
            } else {
                console.log("User data not found");
            }
        }).catch(function (error) {
            console.error("Error fetching user data:", error);
        });
    } else {
        // Redirect or handle the case where there is no user logged in
        window.location.href = "private area.html"; // Redirect to login if not logged in
    }
});

function updateWelcomeMessage(fullName) {
    const h1 = document.querySelector('#welcomeMessage');
    h1.textContent = `Welcome mother to your private area `;
}
