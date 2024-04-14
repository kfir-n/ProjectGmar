// תזין את הנתונים שלך ב-firebaseConfig
const firebaseConfig = {
  apiKey: "AIzaSyCVEjwukELHMRqnj6yjIvmQcDVdPtR5zD4",
  authDomain: "",
  projectId: "finalproj155",
  databaseURL: "https://finalproj155-default-rtdb.firebaseio.com/",
  storageBucket: "",
  messagingSenderId: "498844428369",
  appId: "",
  measurementId: ""
};
currentUser = ""
window.addEventListener("load", () => {
  user = JSON.parse(localStorage.getItem("User"))
  currentUser = JSON.parse(localStorage.getItem("currentUser"))
  // console.log(user);
  console.log(currentUser);

});
const app = firebase.initializeApp(firebaseConfig);   //התחברות לפרויקט בשרת

function saveUserOnDB() {
   var email = document.getElementById("em").value;
   var password = document.getElementById("pass").value;
    
    var auth = firebase.auth();
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        localStorage.setItem("User", JSON.stringify(user));
         alert("Successful registration!");

          
          window.location.href = "login.html";
          console.log(user.uid);
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
          alert("Error: " + errorMessage);
          // ..
        });
  }



function login() {
  email = document.getElementById("email").value
  password = document.getElementById("password").value



  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      localStorage.setItem("currentUser", JSON.stringify(user))
      alert("Successful Login!");
      window.location.href = "private area.html";
      // localStorage.setItem('train', JSON.stringify({}));
      // localStorage.setItem('CompleteTrain', false);
      // Redirect to the homePage after successful login
      // ...
    })
    .catch((error) => {
      // var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      alert("Error: " + errorMessage);

    });


}

function readAndDisplayUsers() {
  var usersRef = database.ref('users');
  usersRef.on('value', function(snapshot) {
      var users = snapshot.val();
      var usersTableBody = document.getElementById("usersTable").getElementsByTagName('tbody')[0];
      usersTableBody.innerHTML = ""; // ניקוי הטבלה לפני הוספת נתונים חדשים
      for (var userId in users) {
          var row = usersTableBody.insertRow(-1); // הוספת שורה לטבלה
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          cell1.textContent = users[userId].username; // או כל שדה אחר שברצונך להציג
          cell2.textContent = users[userId].email; // או כל שדה אחר שברצונך להציג
      }
  });
}

var newMessageRef = database.ref('messages').push();
newMessageRef.set({
    name: "John Doe",
    email: "johndoe@example.com",
    message: "Hello, this is a test message."
})
.then(function() {
    console.log("Message sent successfully");
})
.catch(function(error) {
    console.error("Error sending message: ", error);
});


const database = firebase.database();
const email = currUser.email.replace(".", "_");
var sendMessageBtn = document.getElementById('sendMessageBtn');

// Add event listener to the button
sendMessageBtn.addEventListener('click', function sendMessageToDatabase(name, email, message){});

function sendMessageToDatabase(name, email, message) {

  // Push a new message to the "messages" node
  var newMessageRef = database.ref('messages/').push();
  newMessageRef.set({
      name: name,
      email: email,
      message: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP // Add a timestamp for ordering
  })
  .then(function sendMessageToDatabase(name, email, message) {
      console.log("Message sent successfully");
  })
  .catch(function sendMessageToDatabase(name, email, message) {
      console.error("Error sending message: ", error);
  });
}