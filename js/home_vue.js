//HOME PAGE FIREBASE
// FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase, ref, get, query, orderByChild, onValue , set, update, remove, child } from
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
let user_preference = []
let for_you = {}
let userInfo = {}
let user_upcoming_events = {}
let user_events_keys = []
import ResolvedUID from "./login-common.js";
let current_user = ResolvedUID

// FIREBASE POPULATE DETAILS [USER INFO]
onValue(users, (snapshot => {
	  const data = snapshot.val(); 
	  userInfo = data[current_user].user_profile_info
    user_name = userInfo.name
    console.log(userInfo)
    console.log(data[current_user])
    if (userInfo.preference_info.preference != ["preference"]){
      user_preference = userInfo.preference_info.preference
    }
    let text = "Hello " + user_name + "!"
    document.getElementById("greeting").innerHTML = text
}))

get(query(ref(db, `users/${current_user}/user_events/`), orderByChild("date"))).then((snapshot) => {
    user_upcoming_events = snapshot.val(); 
    let counter = 0
    let current_date = new Date()
    for(let event_info in user_upcoming_events){
      if ("event_id" in user_upcoming_events[event_info]){
        user_events_keys.push(user_upcoming_events[event_info].event_id) 
      }
      if (Object.hasOwnProperty.call(user_upcoming_events, event_info)){
        let info_of_event= user_upcoming_events[event_info].start
        let formatted_event_date = ""
        if (info_of_event.includes("T")){
          let info_split = info_of_event.split("T")
          formatted_event_date = info_split[0]
        }
        else {
          formatted_event_date = info_of_event
        }
        let e_date = new Date(formatted_event_date)
       
        let check = e_date > current_date
          if (check){
            counter += 1
          }
      }
    }
    let number_of_upcoming_events = counter
    UserUpcomingSchoolEvents(number_of_upcoming_events)
});

// FIREBASE POPULATE UPCOMING EVENTS
let upcoming_events = {}
onValue(events, (snapshot => {
	const data = snapshot.val(); // get the new value
	upcoming_events = data
  if (user_preference != []){
    UserForYouEvents()
  }
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
}

const homePage = Vue.createApp({ 
    data() { 
        return { 
            display_events:[],
            db_events: {}, 
            userInfo: '',
            page_current_user: current_user,
            for_you_events: [],
            month_to_num: {
              "January": '01',
              "February": '02',
              "March": '03',
              "April": '04',
              "May": '05',
              "June": '06',
              "July": '07',
              "August": '08',
              "September": '09',
              "October": '10',
              "November": '11',
              "December": '12',
            },
            signed_up_events: [],
            for_you_event_present: false
        };
    }, 
    beforeMount() { 
        this.signed_up_events = user_events_keys
        get(query(events, orderByChild("date"))).then((snapshot) => {
            const data = snapshot.val()
            this.db_events = data
            let current_upcoming_events = {}
            let current_for_you_events = {}
            let upcoming_counter = 0
            let for_you_counter = 0
            snapshot.forEach(childSnapshot => {
              if (upcoming_counter <= 10 && this.check_date(childSnapshot.val().date)){
                let event_id = childSnapshot.val().eventId
                if (!this.signed_up_events.includes(event_id)){
                  current_upcoming_events[event_id] = childSnapshot.val()
                  upcoming_counter += 1
                }
              }
              if (for_you_counter <= 10 && this.check_date(childSnapshot.val().date) && user_preference.includes(childSnapshot.val().type)){
                let event_id = childSnapshot.val().eventId
                if (!this.signed_up_events.includes(event_id)){
                  current_for_you_events[event_id] = childSnapshot.val()
                  for_you_counter += 1
                }
              }
            })
            if (for_you_counter != 0){
              this.for_you_event_present= true
              this.for_you_events = current_for_you_events
            }
            this.display_events = current_upcoming_events
        })
        onValue(users, (snapshot => {
          const data = snapshot.val(); 
          this.userInfo = data[current_user].user_profile_info
        }))
    },
    methods: {
        // ADD ID AND CHANGE DATE
        addEvent(name, club, photo, date, location, time, type, id) {
          const dbRef = ref(getDatabase());
            get(child(dbRef, `users/` + this.page_current_user + `/user_events/`)).then((snapshot) => {
              //   add event to array
                set(ref(db, 'users/' + this.page_current_user + '/user_events/event_' + id), 
                  {
                      title: name,
                      start: this.formatting_start_date(date, time),
                      end: this.formatting_end_date(date, time),
                      category: type,
                      id: id,
                      event_club: club,
                      photo_url: photo,
                      event_date: date,
                      event_location: location,
                      event_time: time,
                  },
                )
            }) 
            // force page to reload
            setTimeout(function(){
              window.location.reload();
            }, 500);
        },

        formatting_start_date(date, time){
          let split_time = time.split("-");
          let start_time = split_time[0]
          let calendar_start_time = start_time.slice(0,2) + ":" + start_time.slice(2,5) + ":00"
          let final_start = date+"T"+calendar_start_time
          return final_start
        },
        formatting_end_date(date, time){
          let split_time = time.split("-");
          let end_time = split_time[1]
          let calendar_end_time = end_time.slice(0,2) + ":" + end_time.slice(2,5) + ":00"
          let final_end = date+"T"+calendar_end_time
          return final_end
        },
        format_date(date) {
          const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          let date_obj = new Date(date)
          let day = date_obj.getDate()
          let month = months[date_obj.getMonth()]
          let year = date_obj.getFullYear()
          let date_formatted = day + " " + month + " " + year
          return date_formatted
      },
      check_date(date){
        let current_date = new Date()
        let e_date = new Date(date)
        return e_date > current_date
      }
    } 
});
const vm = homePage.mount('#homePage'); 

function GetPhotoURL(type){
  let event_media = {'Adventure': './img/event-img/adventure.jpg', 
                    'Arts & Culture': './img/event-img/artsculture.jpg',
                    'Community': './img/event-img/community.jpg',
                    'Global Culture': './img/event-img/globalculture.jpg',
                    'School Society': './img/event-img/schoolsociety.jpg',
                    'Sports': './img/event-img/sports.jpg',
                    'Student Bodies': './img/event-img/studentbodies.jpg',
                    'Academics': './img/event-img/academics.jpg',
                    'Miscellaneous': './img/event-img/miscellaneous.jpg',
                    'Default': './img/event-img/default.jpg'
                    }
  return(event_media[type])
}
function UserUpcomingSchoolEvents (number_of_upcoming_events) {
  if (number_of_upcoming_events >= 6){
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
        <button type="button" data-bs-target="#UpcomingEvents" data-bs-slide-to="5" aria-label="Slide 6"></button>
    </div>
    <div class="carousel-inner">` 
    let current_date = new Date()
    let num_to_month = {
      "01": 'January',
      "02": 'February',
      "03": 'March',
      "04": 'April',
      "05": 'May',
      "06": 'June',
      "07": 'July',
      "08": 'August',
      "09": 'September',
      "10": 'October',
      "11": 'November',
      "12": 'December',
    }
    let counter = 0;
    for (let event in user_upcoming_events) {
    if (Object.hasOwnProperty.call(user_upcoming_events, event)) {
            let name_of_event = user_upcoming_events[event].title
            let photo_of_event = ""
            if("photo_url" in user_upcoming_events[event]){
              photo_of_event= user_upcoming_events[event].photo_url
            }
            else {
              if("category" in user_upcoming_events[event]){
                photo_of_event= GetPhotoURL(user_upcoming_events[event].category)
              }
              else{
                photo_of_event= GetPhotoURL("Default")
              }
            }
            let info_of_event= user_upcoming_events[event].start
            let formatted_event_date = ""
            if (info_of_event.includes("T")){
              let info_split = info_of_event.split("T")
              formatted_event_date = info_split[0]
              let event_date = formatted_event_date.split('-')
              let time = info_split[1].split(':')
              let day = event_date[2]
              let month = event_date[1]
              let year = event_date[0]
              let hour = time[0]
              let min = time[1]
              info_of_event = day + " " + num_to_month[month] + " " + year + ", " + hour + min
            }
            else {
              formatted_event_date = info_of_event
              let event_date = formatted_event_date.split('-')
              let day = event_date[2]
              let month = event_date[1]
              let year = event_date[0]
              info_of_event = day + " " + num_to_month[month] + " " + year
            }
  
            let e_date = new Date(formatted_event_date)
            let check = e_date > current_date

            if (counter == "0" && check){
                tempHTML += `
                <div class="carousel-item active">
                <img src=${photo_of_event} class="d-block w-100" height="300" width="600">
                  <div class="carousel-caption d-block" style = "background-color: white; color: black; font-family: font-family: Georgia, 'Times New Roman', Times, serif">
                      <h5>${name_of_event}</h5>
                      <p>${info_of_event}</p>
                  </div>
                </div>
                `
            }
            else if (check){
                tempHTML += `
                <div class="carousel-item">
                <img src="${photo_of_event}" class="d-block w-100" height="300" width="600">
                  <div class="carousel-caption d-block" style = "background-color: white; opacity color: black; font-family: Georgia, 'Times New Roman', Times, serif">
                    <h5>${name_of_event}</h5>
                    <p>${info_of_event}</p>
                  </div>
                </div>
                `
            }
            counter += 1
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
  else if (number_of_upcoming_events == 0){
    let tempHTML = `
    <div class = "container text-center mt-5 p-5 display-6 rounded" style = "border: 1px solid #ccc; background-color: #4b5358; color: white;" height = 700 >
        No upcoming events
    </div>
    `
    document.getElementById('carousel_user_events').innerHTML = tempHTML
  }
  else {
    let tempHTML = `<br>
    <div class="mx-auto box">
    <div id="UpcomingEvents" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">`
    for (let i = 0; i < number_of_upcoming_events; i++) {
      if(i == 0){
        tempHTML += `<button type="button" data-bs-target="#UpcomingEvents" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>`;
      }
      else {
        tempHTML += `<button type="button" data-bs-target="#UpcomingEvents" data-bs-slide-to="${i}" aria-label="Slide ${i+1}"></button>`
      }
    }
    tempHTML += `</div>
    <div class="carousel-inner">`
    let current_date = new Date()
    let num_to_month = {
      "01": 'January',
      "02": 'February',
      "03": 'March',
      "04": 'April',
      "05": 'May',
      "06": 'June',
      "07": 'July',
      "08": 'August',
      "09": 'September',
      "10": 'October',
      "11": 'November',
      "12": 'December',
    }
    let counter = 0
    for (let event in user_upcoming_events) {
    if (Object.hasOwnProperty.call(user_upcoming_events, event)) {
            let name_of_event = user_upcoming_events[event].title
            let photo_of_event = ""
            if("photo_url" in user_upcoming_events[event]){
              photo_of_event= user_upcoming_events[event].photo_url
            }
            else {
              if("category" in user_upcoming_events[event]){
                photo_of_event= GetPhotoURL(user_upcoming_events[event].category)
              }
              else{
                photo_of_event= GetPhotoURL("Default")
              }
            }
            let info_of_event= user_upcoming_events[event].start
            let formatted_event_date = ""
            if (info_of_event.includes("T")){
              let info_split = info_of_event.split("T")
              formatted_event_date = info_split[0]
              let event_date = formatted_event_date.split('-')
              let time = info_split[1].split(':')
              let day = event_date[2]
              let month = event_date[1]
              let year = event_date[0]
              let hour = time[0]
              let min = time[1]
              info_of_event = day + " " + num_to_month[month] + " " + year + ", " + hour + min
            }
            else {
              formatted_event_date = info_of_event
              let event_date = formatted_event_date.split('-')
              let day = event_date[2]
              let month = event_date[1]
              let year = event_date[0]
              info_of_event = day + " " + num_to_month[month] + " " + year
            }
            let e_date = new Date(formatted_event_date)
            let check = e_date > current_date
            if (counter == "0" && check){
                tempHTML += `
                <div class="carousel-item active">
                <img src=${photo_of_event} class="d-block w-100" height="300" width="600">
                  <div class="carousel-caption d-block" style = "background-color: white; color: black; font-family: font-family: Georgia, 'Times New Roman', Times, serif">
                      <h5>${name_of_event}</h5>
                      <p>${info_of_event}</p>
                  </div>
                </div>
                `
            }
            else if (check){
                tempHTML += `
                <div class="carousel-item">
                <img src="${photo_of_event}" class="d-block w-100" height="300" width="600">
                  <div class="carousel-caption d-block" style = "background-color: white; color: black; font-family: Georgia, 'Times New Roman', Times, serif">
                    <h5>${name_of_event}</h5>
                    <p>${info_of_event}</p>
                  </div>
                </div>
                `
            }
            counter += 1
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
}