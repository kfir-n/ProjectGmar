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
            // If no user is logged in, redirect to the login page
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
function CreateUserData(angle) {
    // Push a new child under 'trainNumber' with the trainDetails
    userRef.child(email).push({
        angleDetails: angle
    });
}

function sendStartToFirebase(start) {
    database.ref('isStart').set(start)
}
function sendStopToFirebase(stop) {
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
            event.preventDefault(); // Prevent any default action
            logout(); // Call your logout function or any other function that needs to run
        });
    }

    const user = firebase.auth().currentUser;
    if (!user) {
        const emailFormatted = userData.email.replace('.', '_'); // Adjust if your database uses different key formats
        const userRef = firebase.database().ref('users/' + emailFormatted);

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
    h1.textContent = `Welcome ${fullName} to your private area `;
}
