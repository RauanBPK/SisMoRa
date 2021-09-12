const admin = require('firebase-admin');
const functions = require('firebase-functions');

var serviceAccount = require('./key/serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ""
});

const db = admin.firestore();

module.exports = db;