// תזין את הנתונים שלך ב-firebaseConfig
const firebaseConfig = {
    apiKey: "AIzaSyCVEjwukELHMRqnj6yjIvmQcDVdPtR5zD4",
    projectId: "finalproj155",
    databaseURL: "https://finalproj155-default-rtdb.firebaseio.com/",
    messagingSenderId: "498844428369",
  };
  
  
const app = firebase.initializeApp(firebaseConfig); // Initialize Firebase app
const database = firebase.database(); // Initialize Firebase database
 // Create a variable for the user's email with '.' replaced by '_'
const email = currUser.email.replace(".", "_");

// Function to register a new user in Firebase Authentication and save additional data to Realtime Database
function registerUser(email, password, otherUserData) {
    firebase.auth().createUserWithEmailAndPassword(email, password) // Create a new user with email and password
      .then((userCredential) => {
        const userId = userCredential.user.uid; // Get the unique user ID
        // Save user data to Realtime Database under 'users' node with the unique user ID as key
        firebase.database().ref('users/' + userId).set({
          email: email,
          pass: pass,
          ...otherUserData // Spread operator to add other user data
        }).then(() => {
          console.log('User data saved to Realtime Database successfully!');
        }).catch((error) => {
          console.error('Failed to save user data to Realtime Database:', error);
        });
      })
      .catch((error) => {
        console.error('Failed to create user:', error);
      });
}

// Example of registering a new user with sample data
registerUser('example@example.com', 'password123', {name: 'John Doe', age: 30});

// Function to register a user using input values from HTML form
function register() {
    const fullName = document.getElementById('name').value; // Get full name from input field
    const email = document.getElementById('em').value; // Get email from input field
    const password = document.getElementById('pass').value; // Get password from input field

    // Call registerUser function with input values and additional user data (name)
    registerUser(email, password, {name: fullName});
}

