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

function fetchHistoryData(email) {
    const database = firebase.database();
    const normalizedEmail = email.replace('.', '_');
    const userWalksRef = database.ref('users/' + normalizedEmail + '/walk');
    userWalksRef.once('value', (snapshot) => {
        const walks = snapshot.val();
        console.log(walks);

       
        const tableBody = document.getElementById('usersTable').querySelector('tbody');
        tableBody.innerHTML = '';  // Clear existing data
        
        Object.entries(walks || {}).forEach(([key, walkEntry]) => {
            console.log(walks);
            let i =0;
            const row = tableBody.insertRow();
            const angleCell = row.insertCell(0);
            const timeCell = row.insertCell(1);
            const totalWalk = row.insertCell(0);
            angleCell.textContent = walkEntry.angleDetails;
            const firstKey = Object.keys(walks)[i];
            console.log("walkent"+walkEntry.time);
            console.log("firstkey" +firstKey);
            timeCell.textContent = new Date(parseInt(walkEntry.time)).toLocaleString();
            totalWalk.textContent = walkEntry.time.toString()-Date.now();
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
        
            // totalWalk.textContent = walkEntry.time.toString();
            console.log(formatMillisecondsToDate(new Date(parseInt(walkEntry.time)).toLocaleString()));
            totalWalk.textContent = formattedTime; 
        });
        i++;
        totalWalk.textContent = 0;
    }).catch((error) => {
        console.error('Error fetching history data:', error);
    });
}

function formatMillisecondsToDate(milliseconds) {
    return new Date(milliseconds).toLocaleString();
}

