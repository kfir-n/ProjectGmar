// Ensure that the Firebase library is loaded before using any Firebase service
document.addEventListener('DOMContentLoaded', function () {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCVEjwukELHMRqnj6yjIvmQcDVdPtR5zD4",
        authDomain: "finalproj155.firebaseapp.com", // Make sure you have the correct authDomain here
        databaseURL: "https://finalproj155-default-rtdb.firebaseio.com/", // And the correct databaseURL
        projectId: "finalproj155",
        storageBucket: "finalproj155.appspot.com",
        messagingSenderId: "your_messagingSenderId",
        appId: "your_appId",
        measurementId: "your_measurementId"
    };
    
    // Initialize Firebase only if it hasn't been initialized already
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            fetchHistoryData();  // If user is signed in, fetch history data
        } else {
            window.location.href = 'login.html';  // If not signed in, redirect to login
        }
    });
});
console.log("test");
document.addEventListener('DOMContentLoaded', function () {
    const firebaseConfig = {
        // Your Firebase configuration
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            fetchHistoryData(user.email);  // Fetch history data using the logged-in user's email
        } else {
            window.location.href = 'login.html';  // Redirect to login if not signed in
        }
    });
});
let i = 0;
function fetchHistoryData(email) {
    const normalizedEmail = email.replace('.', '_');
    const database = firebase.database();
    const userWalksRef = database.ref('users/' + normalizedEmail + '/walk');
    userWalksRef.orderByKey().limitToFirst(99).once('value', (snapshot) => {
        const walks = snapshot.val();
        const keys = Object.keys(walks);
        if (keys.length < 2) {
            console.log("Not enough data to compare two timestamps.");
            return; // Exit if there aren't at least two entries to compare
        }


        const tableBody = document.getElementById('usersTable').querySelector('tbody');
        tableBody.innerHTML = '';  // Clear existing data
        
        Object.entries(walks || {}).forEach(([key, walkEntry]) => {
            console.log(walks);
            
            //
            const firstWalkEntry = walks[keys[0]]; //first object starting time
            console.log("End of the first walk: "  +  firstWalkEntry.time);

            const row = tableBody.insertRow();
            const angleCell = row.insertCell(0);
            const timeCell = row.insertCell(1);
            const totalWalk = row.insertCell(0);
            //
            console.log("i is equal to: "+ i);

            angleCell.textContent = walkEntry.angleDetails;
            const firstKey = Object.keys(walks)[i];
            console.log("Starting time: " +firstKey);
            console.log("End time: "+walkEntry.time);
            let CurrentDateAndTime = formatMillisecondsToDate(new Date(parseInt(walkEntry.time)).toLocaleString()).slice(0,8);
            console.log("The CurrentDateAnd Time is :   "+CurrentDateAndTime);
            timeCell.textContent = CurrentDateAndTime;
            totalWalk.textContent = walkEntry.time.toString()-Date.now();
            //The Calculation
             const durationMilliseconds =  walkEntry.time - firstKey;
             const seconds = Math.floor((durationMilliseconds / 1000) % 60);
             const minutes = Math.floor((durationMilliseconds / (1000 * 60)) % 60);
             const hours = Math.floor((durationMilliseconds / (1000 * 60 * 60)) % 24);
            // totalWalk.textContent = walkEntry.tostring();
            const formattedTime = [
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0')
            ].join(':');
            i++;
            totalWalk.textContent = formattedTime; 

        });
    }).catch((error) => {
        console.error('Error fetching history data:', error);
    });
}

function formatMillisecondsToDate(milliseconds) {
    return new Date(milliseconds).toLocaleString();
}

function printPage() {
    window.print();
}

//  // Function to refresh page every 30 seconds
//  setInterval(function() {
//     window.location.reload();
// }, 2500); // 30000 milliseconds = 30 seconds