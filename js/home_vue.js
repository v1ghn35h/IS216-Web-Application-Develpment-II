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
let upcoming_events = {}
let for_you = {}
let user_upcoming_events = {}

// FIREBASE POPULATE DETAILS [USER INFO]
onValue(users, (snapshot => {
	const data = snapshot.val(); 
	userInfo_data = data.user1.user_profile_info
    user_name = userInfo_data.name
    user_email = userInfo_data.email
    user_matric = userInfo_data.matric_no
    user_preference = userInfo_data.preference_info.preference
    user_upcoming_events = data.user1.user_events
    var typed = new Typed(".auto-type", {
      strings: [ `Welcome ${user_name}!`, `How are you doing today?`],
      typeSpeed: 100,
      backspeed: 300,
      loop: false
  })
  UserUpcomingSchoolEvents()
}));

// FIREBASE POPULATE UPCOMING EVENTS
onValue(events, (snapshot => {
	const data = snapshot.val(); // get the new value
	upcoming_events = data
  UserForYouEvents()
}));

function UserForYouEvents () {
  for (let event in upcoming_events) {
  if (Object.hasOwnProperty.call(upcoming_events, event)) {
          let type_of_event= upcoming_events[event].type
          if (user_preference.includes(type_of_event)){
            var name = event;
            var info = upcoming_events[event];
            for_you[name] = info;
      }
  }}
  console.log(for_you)
}


const homePage = Vue.createApp({ 
    data() { 
        return { 
            display_events: {},
            db_events: {}, 
            userInfo: '',
            current_user: "user1",
            for_you_events: {},
        };
    }, 
    beforeMount() { 
        onValue(events, (snapshot) => {
            const data = snapshot.val()
            this.db_events = data
            this.display_events = this.db_events
        })
        onValue(users, (snapshot) => {
            const data = snapshot.val()
            this.userInfo = data.user1.user_profile_info
            this.preferences = this.userInfo.preferences
        })
        this.for_you_events = for_you
    },
    methods: {
        // ADD ID AND CHANGE DATE
        addEvent(name, club, photo, date, location, time) {
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
                    } 
                    else {
                      console.log("No data available");
                    }
                  }).catch((error) => {
                    console.error(error);
                  });        
        },
    } 
});

const vm = homePage.mount('#homePage'); 

function UserUpcomingSchoolEvents () {
  let tempHTML = `
  <br>
  <div class="mx-auto box">
  <div id="UpcomingEvents" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-indicators">
      <button type="button" data-bs-target="#UpcomingEvents" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#UpcomingEvents" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#UpcomingEvents" data-bs-slide-to="2" aria-label="Slide 3"></button>
      <button type="button" data-bs-target="#UpcomingEvents" data-bs-slide-to="3" aria-label="Slide 4"></button>
      <button type="button" data-bs-target="#UpcomingEvents" data-bs-slide-to="4" aria-label="Slide 5"></button>
  </div>
  <div class="carousel-inner">`
  var current_date = new Date();
  var current_day = String(current_date.getDate()).padStart(2, '0');
  var current_month = String(current_date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var current_year = current_date.getFullYear();
  
  let counter = 0;

  for (let event in user_upcoming_events) {
  if (Object.hasOwnProperty.call(user_upcoming_events, event) && (counter <= 5)) {
          // || counter != user_upcoming_events.length)
          let name_of_event = user_upcoming_events[event].title
          let photo_of_event= user_upcoming_events[event].photo_url
          let date_of_event= user_upcoming_events[event].start
          // let date_list = date_of_event.split("-")
          // let day_of_event = date_list [2]
          // let year_of_event= date_list [0]
          // let month_of_event= date_list [1]
          // if(current_year<=year_of_event && current_month == month_of_event && current_day <= day_of_event){
              if (counter == "0"){
                  tempHTML += `
                  <div class="carousel-item active">
                  <img src="${photo_of_event}" class="d-block w-100" alt="..." height="300" width="600">
                  <div class="carousel-caption d-block" style = "background-color: white; color: black; font-family: font-family: Georgia, 'Times New Roman', Times, serif">
                      <h5>${name_of_event}</h5>
                      <p>${date_of_event}</p>
                  </div>
                  </div>
                  `
              }
              else {
                  tempHTML += `
                  <div class="carousel-item">
                  <img src="${photo_of_event}" class="d-block w-100" alt="..." height="300" width="600">
                  <div class="carousel-caption d-block" style = "background-color: white; color: black; font-family: Georgia, 'Times New Roman', Times, serif">
                      <h5>${name_of_event}</h5>
                      <p>${date_of_event}</p>
                  </div>
                  </div>
                  `
              }
              counter += 1
          // }
      }}
  
  tempHTML += `
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#UpcomingEvents" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#UpcomingEvents" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
  </button>
  </div>
  </div>
  `
  document.getElementById('carousel_user_events').innerHTML = tempHTML
}