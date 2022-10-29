// FIREBASE SECTION
// ----------------------------------------------------------------
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
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

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      window.location.href = "home.html"
    } else {
      // User is signed out
      // ...
    }
});

// Login
function login(event) {
    event.preventDefault();
    
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            let loginErrorBox = document.getElementById("loginErrors");
            loginErrorBox.innerHTML = "";
            let loginError = (message) => {
                let loginErrorWrapper = document.createElement('div')
                loginErrorWrapper.innerHTML = [
                  `<div class="alert alert-danger alert-dismissible" role="alert">`,
                  `   <div>${message}</div>`,
                  '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                  '</div>'
                ].join('')
              
                loginErrorBox.append(loginErrorWrapper)
            }
            loginError(errorMessage);
        });
}
// Add login function as global variable as this is a module type js file
window.loginFunction = login;

// ----------------------------------------------------------------
// VUE SECTION
// ----------------------------------------------------------------
const VueApp = Vue.createApp({
    data() {
        return {
            // name:value pairs,
            // name:value pairs
            displayLogin: "block",
            displayForgotPass: "none"
        }
    },
    methods: {
        loginPage() {
            this.displayLogin = "block",
            this.displayForgotPass = "none"
        },
        forgotPass() {
            this.displayLogin = "none",
            this.displayForgotPass = "block"
        }
    },
    computed: {
        // works like methods, but will only run once with {{ functionName }}
        // result of first run is stored and referenced with {{ functionName }} without rerunning method
    }
})

const vm = VueApp.mount('#vue-app')