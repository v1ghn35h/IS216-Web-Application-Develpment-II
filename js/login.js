// ----------------------------------------------------------------
// VUE SECTION
// ----------------------------------------------------------------
const VueApp = Vue.createApp({
    data() {
        return {
            // name:value pairs,
            // name:value pairs
            displayLogin: "block",
            displayForgotPass: "none",
            displaySignup: "none"
        }
    },
    methods: {
        loginPage() {
            this.displayLogin = "block",
            this.displayForgotPass = "none",
            this.displaySignup = "none",
            document.title = "Login | calendaREADY"
        },
        forgotPassPage() {
            this.displayLogin = "none",
            this.displayForgotPass = "block",
            this.displaySignup = "none",
            document.title = "Forgot Password | calendaREADY"
        },
        signupPage() {
            this.displayLogin = "none",
            this.displayForgotPass = "none",
            this.displaySignup = "block",
            document.title = "Sign Up | calendaREADY"
        }
    },
    computed: {
        // works like methods, but will only run once with {{ functionName }}
        // result of first run is stored and referenced with {{ functionName }} without rerunning method
    }
})

const vm = VueApp.mount('#vue-app')
// ----------------------------------------------------------------
// FIREBASE SECTION
// ----------------------------------------------------------------
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
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

// ----------------------------------------------------------------
// LOGIN FUNCTIONS SECTION
// ----------------------------------------------------------------

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
let loginErrorMessages = {
    "auth/internal-error": true,
    "auth/invalid-email": true,
    "auth/user-not-found": true,
    "auth/wrong-password": true
}

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
            // console.log(errorCode, errorMessage);
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
            // loginError(loginErrorMessages[errorCode]);
            // If the above is required, create a loginErrorMessages object that links errorCode to readable text

            if (errorCode in loginErrorMessages) {
                loginError("Wrong/Invalid email or password!")
            } else {
                loginError("Error: " + errorCode)
            }
        });
}
document.loginFunction = login;

// Forgot Password
function forgotPass(event) {
    event.preventDefault();
    // something
    console.log("forgotPass()")
}
document.forgotPassFunction = forgotPass;

// Signup
let signupErrorMessages = {
    "auth/email-already-in-use": "That email already has an account! Try Login Page > Forgot Password",
    "auth/invalid-email": "Please enter a valid email!",
    "auth/internal-error": "Wrong/Invalid email or password!",
    "auth/weak-password": "Please enter a stronger password!"
}

function signup(event) {
    event.preventDefault();

    let email = document.getElementById("signupEmail").value;
    let password = document.getElementById("signupPassword").value;

    let signupErrorBox = document.getElementById("signupErrors");
    signupErrorBox.innerHTML = "";
    let signupError = (message) => {
        let signupErrorWrapper = document.createElement("div")
        signupErrorWrapper.innerHTML = [
            `<div class="alert alert-danger alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join("")
        signupErrorBox.append(signupErrorWrapper)
    }

    if (password != document.getElementById("signupPasswordConfirm").value) {
        signupError("The passwords don't match!")
    } else {
        
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);

            if (errorCode in signupErrorMessages) {
                signupError(signupErrorMessages[errorCode])
            } else {
                signupError("Error: " + errorCode)
            }
        });

    }
}
document.signupFunction = signup;