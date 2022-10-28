// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_sRHAqy76KR30qWRWTT1HjahFEN0IN4Q",
  authDomain: "calendaready-g7t7.firebaseapp.com",
  databaseURL: "https://calendaready-g7t7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "calendaready-g7t7",
  storageBucket: "calendaready-g7t7.appspot.com",
  messagingSenderId: "544037155570",
  appId: "1:544037155570:web:c7e3ca7a1c55beaea8966b",
  measurementId: "G-03K9PHBX7D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


/* CONNECT TO DATABASE */
// Import functions needed to read from realtime database
import { getDatabase, ref, onValue } from
"https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js"

// Connect to the realtime database
const db = getDatabase();

// Get a reference to the data 'title'
const users = ref(db, 'users') 

// firebase console object syntax: { "creator": "Robin", "roomName": "Holy Robert Louis Stevenson" }

// Update user's calendar
onValue(users, (snapshot => {
  const data = snapshot.val(); // get the new value

  // let user1 = data.user1
  // let user_name = user1.user_profile_info.username

  // document.getElementById('target').innerText = user_name;
}));
