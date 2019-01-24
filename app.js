const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
var admin = require("firebase-admin");

app.listen(PORT, () => {
	console.log('app listen on port '+PORT)
})

var serviceAccount = require("./udara-5e09a-firebase-adminsdk-pxdwh-6c78877dc7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://udara-5e09a.firebaseio.com"
});

var db = admin.firestore();
db.settings({timestampsInSnapshots: true})

var users = db.collection('users');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/', (req, res) => {
	users.get()
	.then(snapshot => {
		snapshot.forEach(doc => {
			console.log(doc.id, '=>', doc.data());
			res.status(200).json(doc.data())
		});
	})
	.catch(err => {
		console.log('Error getting documents', err);
	});
})

app.post('/daftar', (req, res) => {
	users.add({
		fullname: req.body.fullname,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	}).then(ref => {
		console.log('Added document with ID: ', ref.id);
	});
})