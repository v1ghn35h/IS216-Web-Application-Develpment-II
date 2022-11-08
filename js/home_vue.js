//HOME PAGE FIREBASE
// FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase, ref, get, onValue , set, update, remove, child } from
"https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js"
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

//////////////////////////////////////////////////
// FIREBASE CONFIGURATION
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
const events = ref(db, 'events')

//////////////////////////////////////////////////

//initialise global variables
let user_name = ""
let user_email = ""
let user_matric = ""
let user_preference = []
let userInfo_data = {}

// FIREBASE POPULATE DETAILS [USER INFO]
onValue(users, (snapshot => {
	const data = snapshot.val(); 
	userInfo_data = data.user1.user_profile_info
    user_name = userInfo_data.name
    user_email = userInfo_data.email
    user_matric = userInfo_data.matric_no
    user_preference = userInfo_data.preference
}));

// FIREBASE POPULATE UPCOMING EVENTS
let upcoming_events = {}
onValue(events, (snapshot => {
	const data = snapshot.val(); // get the new value
	upcoming_events = data
}));

const homePage = Vue.createApp({ 
    data() { 
        return { 
            display_events: {},
            db_events: '', // this stores all events extracted from db
            userInfo: '',
            preferences: [],
            current_user: "user1",
            title: "",
            start: "",
            end: "",
            category: "",
            id: "",
            event_club: "",
            event_photo: "",
            event_date: "",
            event_location: "",
            event_time: "",
        };
    }, // data
    // }, // computed
    // created() { 
    // },
    beforeMount() { 
        onValue(events, (snapshot) => {
            const data = snapshot.val()
            this.db_events = data
            this.display_events = data
        })
        onValue(users, (snapshot) => {
            const data = snapshot.val()
            this.userInfo = data.user1.user_profile_info
        })
    },
    methods: {
        addEvent(name, club, photo, date, location, time) {
            console.log(name)
            console.log(club)
            console.log(photo)
            console.log(date)
            console.log(location)
            console.log(time)
            const dbRef = ref(getDatabase());
                  get(child(dbRef, `users/` + this.current_user + `/user_events/`)).then((snapshot) => {
                    if (snapshot.exists()) {
                      var db_values = snapshot.val();
                      var db_size = Object.keys(db_values).length
                      var new_db_size = db_size + 1
                    //   add event to array
                      set(ref(db, 'users/' + this.current_user + '/user_events/event_' + new_db_size), 
                        {
                            title: name,
                            start: time,
                            end: time,
                            category: "hello",
                            id: "hello",
                            event_club: club,
                            event_photo: photo,
                            event_date: date,
                            event_location: location,
                            event_time: time,
                        },
                      )
                    //   // display added successfully
                    //   $('#successModal').modal('show');
                    } 
                    else {
                      console.log("No data available");
                    }
                  }).catch((error) => {
                    console.error(error);
                  });        
        }
       
    } 
});

const vm = homePage.mount('#homePage'); 

