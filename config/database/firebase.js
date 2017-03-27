var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyBPzumhlybSGUi6hHOb2421ZAPJM-487Lo",
    authDomain: "fundoohr-d4100.firebaseapp.com",
    databaseURL: "https://fundoohr-d4100.firebaseio.com",
    storageBucket: "fundoohr-d4100.appspot.com",
    messagingSenderId: "52019277874"
};
firebase.initializeApp(config);

module.exports = firebase;
