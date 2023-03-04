// Import the functions you need from the SDKs you need
const admin = require("firebase-admin");
require("dotenv").config();
const serviceAccount = require(process.env.FIREBASE_CREDENTIALS);
const { getFirestore } = require("firebase-admin/firestore");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZS_R5VIL3qB44_TLGDaZZeG5eCCfJzaQ",
  authDomain: "albion-discord-bot-9ca40.firebaseapp.com",
  projectId: "albion-discord-bot-9ca40",
  storageBucket: "albion-discord-bot-9ca40.appspot.com",
  messagingSenderId: "387888252287",
  appId: "1:387888252287:web:cae8b152e17be720c8c64a",
};

// Initialize Firebase
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = getFirestore();

module.exports = { app, db };
