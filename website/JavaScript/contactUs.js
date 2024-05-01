// תזין את הנתונים שלך ב-firebaseConfig
const firebaseConfig = {
    apiKey: "AIzaSyCVEjwukELHMRqnj6yjIvmQcDVdPtR5zD4",
    projectId: "finalproj155",
    databaseURL: "https://finalproj155-default-rtdb.firebaseio.com/",
    messagingSenderId: "498844428369",
  };
  currentUser = ""; // Variable to hold the current user
  window.addEventListener("load", () => {
    user = JSON.parse(localStorage.getItem("User")); // Read user from localStorage
    currentUser = JSON.parse(localStorage.getItem("currentUser")); // Read current user from localStorage
    console.log(currentUser); // Log the current user to console
  });
  const app = firebase.initializeApp(firebaseConfig); // Connect to the project on the Firebase server
  const database = firebase.database(); // Database reference

 // Reference to 'contactUsMessages' node in Realtime Database


// // Function to send a message with email and message details to Realtime Database
// function sendMessage(email, message) {
//     // Push a new message under 'contactUsMessages' with email and message details
//     messagesRef.set({
//       email: email,
//       subject: subject,
//       message: message,
//     });
// }

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
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}:${millisecondsFormatted}`;

    return formattedDate;
}

// Add event listener to the form for form submission
document.getElementById('sendMessageBtn').addEventListener('submit',  submitForm);

// Function to send a message with all details to Realtime Database
function sendMessage(name, email, phone, subject, message) {
    firebase.database().ref('contactUsMessages/'+formatDate(Date.now())).set({
        email: email,
        name: name,
        phone: phone,
        subject: subject,
        message: message
    });
}

// Function to handle form submission
function submitForm(event) {
    
    event.preventDefault(); // Prevent default form submission behavior
        
    // Get values from the form
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var subject = document.getElementById('subject').value;
    var message = document.getElementById('message').value;
    
    // Call sendMessage function with form values
    sendMessage(name, email, phone, subject, message);
    alert("message sent successfuly");

    // Clear the form after submission
    document.querySelector('name').value = '';
    document.querySelector('em').value = '';
    document.querySelector('phone').value = '';
    document.querySelector('subject').value = '';
    document.querySelector('message').value = '';

}
 
