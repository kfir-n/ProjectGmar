// תזין את הנתונים שלך ב-firebaseConfig
const firebaseConfig = {
    apiKey: "AIzaSyCVEjwukELHMRqnj6yjIvmQcDVdPtR5zD4",
    projectId: "finalproj155",
    databaseURL: "https://finalproj155-default-rtdb.firebaseio.com/",
    messagingSenderId: "498844428369",
  };
  
  
  const app = firebase.initializeApp(firebaseConfig); // אתחול של ה-App של Firebase
  const database = firebase.database(); // הקשר עם מסד הנתונים
  const email = currUser.email.replace(".", "_"); // יצירת משתנה לאימייל של המשתמש
  // פונקציה לשמירת משתמש חדש במסד הנתונים
  function registerUser(email, password, otherUserData) {
    // יצירת משתמש ב-Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // המשתמש נרשם בהצלחה, עכשיו נוסיף את שאר הנתונים ל-Realtime Database
        const userId = userCredential.user.uid;
        firebase.database().ref('users/' + userId).set({
          email: email,
          ...otherUserData
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
  
  // קריאה לפונקציה עם דוגמה לנתונים
  registerUser('example@example.com', 'password123', {name: 'John Doe', age: 30});
  
  function register() {
    const fullName = document.getElementById('name').value;
    const email = document.getElementById('em').value;
    const password = document.getElementById('pass').value;

    // כאן תבצע את קריאת הפונקציה לרישום לפי הדוגמה שנתתי קודם
    registerUser(email, password, {name: fullName});
}  // פונקציה להתחברות למערכת
 
    
  const messagesRef = database.ref('contactUsMessages/');
  
  function sendMessage(email, message) {
    // Push a new message under 'contactUsMessages' with the email and message details
    messagesRef.set({
      email: email,
      message: message
    });
  }