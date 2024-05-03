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