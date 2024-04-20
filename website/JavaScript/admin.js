const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = 3000;

// נתיב לקובץ התצורה של Firebase Admin
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(express.static('public')); // שמירת קבצי HTML ו-JS בתיקייה זו

app.get('/users', (req, res) => {
  admin.auth().listUsers(1000).then(listUsersResult => {
    res.send(listUsersResult.users.map(user => user.toJSON()));
  }).catch(error => {
    res.status(500).send(error);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
