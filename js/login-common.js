// ----------------------------------------------------------------
// FIREBASE SECTION
// ----------------------------------------------------------------
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
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
const auth = getAuth(app);
var FirebaseUID = null;
var userData = null;

// ----------------------------------------------------------------
// LOGIN FUNCTIONS SECTION
// ----------------------------------------------------------------

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
        FirebaseUID = user.uid;

        // Check if user account existed before, if not, create in Firebase
        const dbUser = ref(getDatabase(), `users/${user.uid}`);
        onValue (dbUser, (snapshot) => {
            userData = snapshot.val();
            if (userData == null) {
                set (dbUser, {
                    "user_profile_info": {
                        "name": "New User",
                        "username": "<Unknown>",
                        "gender": "<Unknown>",
                        "birthday": "<Unknown>",
                        "school": "<Unknown>",
                        "email": user.email,
                        "matric_no": "<Unknown>",
                        "phone_no": "<Unknown>",
                        "preference_info": {
                            "preference": [""]
                        },
                        "profile_picture": {
                            "picture_url": "url('img/default_pfp.png')"
                        }
                    },
                    "user_tasks": {},
                    "user_events": {}
                })
            } else if (userData.user_profile_info.name == "New User - Update Profile Page") {
                let location_arr = window.location.href.split("/")
                if (location_arr[location_arr.length -1] !== "profile.html") {
                    // window.location.href = "profile.html"
                }
            }
            // Otherwise, make sure user's account details can be retrieved in other pages (login-common.js)
        });
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // ...
    } else {
      // User is signed out
      // ...
      window.location.href = "login.html"
    }
});

// Logout
function logoutFunction() {
    signOut(auth)
        .then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
}
document.logoutFunction = logoutFunction;

// ----------------------------------------------------------------
// EXPORT FIREBASE USER UID SECTION
// ----------------------------------------------------------------

let ResolvedUID = new Promise(function(resolve) {
    let check = setInterval(function() {
        if (FirebaseUID && userData) {
            clearInterval(check);
            resolve(FirebaseUID)
        }
    }, 10);
})

export default await ResolvedUID;