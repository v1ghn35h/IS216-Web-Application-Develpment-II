// FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase, ref, onValue , set } from
"https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js"
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

//////////////////////////////////////////////////
// FIREBASE VARIABLES
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
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const users = ref(db, 'users') 
// const clubs = ref(db, 'clubs')
const allEvents = ref(db, 'events')


//////////////////////////////////////////////////


// <div id='app'></div>
const explorePage = Vue.createApp({ 
    data() { 
        return { 
            hello: "testing",
            events: '',
            userInfo: '',
        };
    }, // data
    computed: { 
        derivedProperty() {
            
        } } ,
    // }, // computed
    // created() { 
    // },
    beforeMount() { 
        onValue(allEvents, (snapshot) => {
            const data = snapshot.val()
            console.log("-------In mounted------");
            console.log(data);
            this.events = data
            console.log(this.events);
        })
        onValue(users, (snapshot) => {
            const data = snapshot.val()
            console.log("-------In mounted------");
            console.log(data);
            this.userInfo = data.user1.user_profile_info
            console.log(this.userInfo);
        })
    },
    methods: {
        methodName() {
            
        }
    } // methods
});

const vm = explorePage.mount('#explorePage'); 

// ======================================couldnt figure out component

// explorePage.component('anEvent', { 

//     props: [ 'name', 'club', 'date', 'time', 'fees', 'location', 'photo' ],

//      // props
    
//     data() {
        
//     }, // data
    
//     methods: {
//         methodName() {
            
//         }
//     }, // methods
    
//     template: `
//     <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
//         <a href="">
//             <div class="card-flyer">
//                 <div class="text-box">
//                     <div class="image-box">
//                         <img :src="photo" alt="" />
//                     </div>
//                     <div class="text-container">
//                         <h5 class="card-title"> {{ name }} </h5>  
//                         <!-- SUBTITLE -->
//                         <h6 class="card-subtitle mb-2 "> {{ club }} </h6>
//                         <!-- BODY -->
//                         <p class="card-text text-wrap">
//                             Date: {{ date }}
//                             <br>
//                             Time: {{ time }}
//                             <br>
//                             Fees: {{ fees }}
//                             <br>
//                             Location: {{ location }}
//                         </p>
//                         <!-- sign up button-->
//                         <div>
//                             <button type="button" class="btn signup-btn mt-3" data-bs-target="#SignUpPage" data-bs-toggle="modal">Sign up now</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </a>
//     </div>`
// });
// component must be declared before app.mount(...)
