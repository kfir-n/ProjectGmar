// Ensure that the Firebase library is loaded before using any Firebase service
document.addEventListener('DOMContentLoaded', function () {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCVEjwukELHMRqnj6yjIvmQcDVdPtR5zD4",
        authDomain: "finalproj155.firebaseapp.com", 
        databaseURL: "https://finalproj155-default-rtdb.firebaseio.com/",
        projectId: "finalproj155",
        storageBucket: "finalproj155.appspot.com",
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
    const formattedDate = `${hours}:${minutes}:${seconds}:${millisecondsFormatted}`;

    return formattedDate;
}
let i =0;
function fetchHistoryData(email) {
    const database = firebase.database();
    const normalizedEmail = email.replace('.', '_');
    const userWalksRef = database.ref('users/' + normalizedEmail + '/walk');
    userWalksRef.orderByKey().limitToFirst(2).once('value', (snapshot) => {
        const walks = snapshot.val();
        const keys = Object.keys(walks);
        if (keys.length < 2) {
            console.log("Not enough data to compare two timestamps.");
            return; // Exit if there aren't at least two entries to compare
        }

        const firstKey = Object.keys(walks)[i];
        // Access the first two walk entries
        const firstWalkEntry = walks[keys[0]];
        const secondWalkEntry = firstKey;


        // Calculate the difference between the two timestamps
        const timeDifference = calculateDateDifference(firstWalkEntry.time, secondWalkEntry.time);

        // Logging or handling the time difference
        console.log("Time difference between the first two entries:", timeDifference);

        const tableBody = document.getElementById('usersTable').querySelector('tbody');
        tableBody.innerHTML = ''; // Clear existing data
        // Assuming we are just going to display these two for simplicity
        [firstWalkEntry, secondWalkEntry].forEach((entry, index) => {
            const row = tableBody.insertRow();
            const dateCell = row.insertCell(0);
            const angleCell = row.insertCell(1);
            const timeStampCell = row.insertCell(2);

            const formattedTimestamp = formatDate(entry.time);

            dateCell.textContent = keys[index].slice(0,10); // Assuming the key contains the date
            angleCell.textContent = entry.angle;
            timeStampCell.textContent = formattedTimestamp;
        });
        
    }).catch((error) => {
        console.error('Error fetching history data:', error);
    });
}

// Make sure these helper functions are correctly defined in your script
function calculateDateDifference(dateString1, dateString2) {
    const date1 = parseCustomDate(dateString1);
    const date2 = parseCustomDate(dateString2);

    const diffMilliseconds = Math.abs(date1 - date2);
    return {
        milliseconds: diffMilliseconds,
        seconds: diffMilliseconds / 1000,
        minutes: diffMilliseconds / 1000 / 60,
        hours: diffMilliseconds / 1000 / 60 / 60
    };
}

function parseCustomDate(dateString) {
    const parts = dateString.split(/[- :]/);
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const hours = parseInt(parts[3], 10);
    const minutes = parseInt(parts[4], 10);
    const seconds = parseInt(parts[5], 10);
    const milliseconds = parseInt(parts[6], 10);

    return new Date(year, month, day, hours, minutes, seconds, milliseconds);
}
