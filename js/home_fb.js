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


//things let to do for home page
// 1. make it load faster if possible
// 2. Add event to firebase
// 3. carousel
// 4. figure out how to reflect the changes we make in the database



//initialise global variables
let user_name = ""
let user_email = ""
let user_matric = ""
let user_preference = []

// FIREBASE POPULATE DETAILS [USER INFO]
onValue(users, (snapshot => {
	const data = snapshot.val(); 
	let userInfo = data.user1.user_profile_info
    user_name = userInfo.name
    user_email = userInfo.email
    user_matric = userInfo.matric_no
    user_preference = userInfo.preference
	var typed = new Typed(".auto-type", {
        strings: [ `Welcome ${user_name}!`, `How are you doing today?`],
        typeSpeed: 100,
        backspeed: 300,
        loop: true
    })
}));

// FIREBASE POPULATE UPCOMING EVENTS
let upcoming_events = {}
onValue(events, (snapshot => {
	const data = snapshot.val(); // get the new value
	upcoming_events = data
	UpcomingSchoolEvents()
    UserForYouEvents()
    UserUpcomingSchoolEvents()
}));

function UpcomingSchoolEvents () {
    let tempHTML = ""
    for (let event in upcoming_events) {
		if (Object.hasOwnProperty.call(upcoming_events, event)) {
            let name_of_event = upcoming_events[event].name
            let club_of_event = upcoming_events[event].club
            let type_of_event= upcoming_events[event].type
            let photo_of_event= upcoming_events[event].photo
            let date_of_event= upcoming_events[event].date
            let time_of_event= upcoming_events[event].time
            let fees_of_event= upcoming_events[event].fees
            let location_of_event= upcoming_events[event].location
            let event_id= upcoming_events[event].eventId
				tempHTML += `<div class="card mx-1" style="width: 18rem;">
                <!-- PLACE IMAGE ON TOP OF CARD -->
            <img src = ${photo_of_event} height = "125" class="card-img-top" alt="...">
            <!-- HEADER [can be added to h* elements]-->
            <div class="card-body">
                <!-- TITLE -->
                <h5 class="card-title" id = "name">${name_of_event}</h5>  
                <!-- SUBTITLE -->
                <h6 class="card-subtitle mb-2 text-muted">${club_of_event}</h6>
                <!-- BODY -->
                <p class="card-text text-wrap">
                    Date: ${date_of_event}
                    <br>
                    Time: ${time_of_event}
                    <br>
                    Fees: ${fees_of_event}
                    <br>
                    Location: ${location_of_event}
                </p>
                <!-- BUTTON -->
                <!-- Modal -->
                <div class="modal fade" id="event${event_id}" tabindex="-1" aria-labelledby="event${event_id}Label" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="InfoPageLabel">${name_of_event}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="container">
                            <img src = ${photo_of_event} width= "300px" height = "250px" alt="..." class="center">
                            </div>
                            <p class = "display-6 lead text-center mt-3">Event Information</p>
                            <hr>
                            <div class="container text-break p-3 mt-3 fs-6">
                            CCA: ${club_of_event}
                            <br>
                            Date: ${date_of_event}
                            <br>
                            Time: ${time_of_event}
                            <br>
                            Fees: ${fees_of_event}
                            <br>
                            Location: ${location_of_event}
                            </div>
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-dark" data-bs-target="#event${event_id}SignUpPage" data-bs-toggle="modal">Sign up now</button>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="modal fade" id="event${event_id}SignUpPage" aria-hidden="true" aria-labelledby="event${event_id}SignUpPageLabel" tabindex="-1">
                    <div class="modal-dialog modal-dialog-scrollable modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="event${event_id}SignUpPageLabel">Sign Up Page</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p class = "display-6 lead text-center mt-3">${name_of_event}</p>
                            <div class="container text-break p-3 mt-3 fs-6">
                            Name: ${user_name}
                            <br>
                            Email: ${user_email}
                            <br>
                            Matriculation: ${user_matric}
                            <br>
                            Payment: ${fees_of_event}                
                            </div>
                            <button class="btn btn-warning center" id="add">Confirm</button>
                        </div>
                        <div class="modal-footer">
                        <button class="btn btn-dark" data-bs-target="#event${event_id}" data-bs-toggle="modal">Go back</button>
                        </div>
                    </div>
                    </div>
                </div>
                <a class="btn btn-dark" data-bs-toggle="modal" href="#event${event_id}" role="button">More info</a>
            
            </div>
            </div>`
    }}
    document.getElementById('upcoming').innerHTML = tempHTML
}
function UserForYouEvents () {
    let tempHTML = ""
    for (let event in upcoming_events) {
		if (Object.hasOwnProperty.call(upcoming_events, event)) {
            let name_of_event = upcoming_events[event].name
            let club_of_event = upcoming_events[event].club
            let type_of_event= upcoming_events[event].type
            let photo_of_event= upcoming_events[event].photo
            let date_of_event= upcoming_events[event].date
            let time_of_event= upcoming_events[event].time
            let fees_of_event= upcoming_events[event].fees
            let location_of_event= upcoming_events[event].location
            let event_id= upcoming_events[event].eventId
            if (user_preference.includes(type_of_event)){
				tempHTML += `<div class="card mx-1" style="width: 18rem;">
                <!-- PLACE IMAGE ON TOP OF CARD -->
            <img src = ${photo_of_event} height = "125" class="card-img-top" alt="...">
            <!-- HEADER [can be added to h* elements]-->
            <div class="card-body">
                <!-- TITLE -->
                <h5 class="card-title" id = "name">${name_of_event}</h5>  
                <!-- SUBTITLE -->
                <h6 class="card-subtitle mb-2 text-muted">${club_of_event}</h6>
                <!-- BODY -->
                <p class="card-text text-wrap">
                    Date: ${date_of_event}
                    <br>
                    Time: ${time_of_event}
                    <br>
                    Fees: ${fees_of_event}
                    <br>
                    Location: ${location_of_event}
                </p>
                <!-- BUTTON -->
                <!-- Modal -->
                <div class="modal fade" id="event${event_id}" tabindex="-1" aria-labelledby="event${event_id}Label" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="InfoPageLabel">${name_of_event}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="container">
                            <img src = ${photo_of_event} width= "300px" height = "250px" alt="..." class="center">
                            </div>
                            <p class = "display-6 lead text-center mt-3">Event Information</p>
                            <hr>
                            <div class="container text-break p-3 mt-3 fs-6">
                            CCA: ${club_of_event}
                            <br>
                            Date: ${date_of_event}
                            <br>
                            Time: ${time_of_event}
                            <br>
                            Fees: ${fees_of_event}
                            <br>
                            Location: ${location_of_event}
                            </div>
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-dark" data-bs-target="#event${event_id}SignUpPage" data-bs-toggle="modal">Sign up now</button>
                        </div>
                    </div>
                    </div>
                </div>
                <!-- Sign Up Page -->
                <div class="modal fade" id="event${event_id}SignUpPage" aria-hidden="true" aria-labelledby="event${event_id}SignUpPageLabel" tabindex="-1">
                    <div class="modal-dialog modal-dialog-scrollable modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="event${event_id}SignUpPageLabel">Sign Up Page</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p class = "display-6 lead text-center mt-3">${name_of_event}</p>
                            <div class="container text-break p-3 mt-3 fs-6">
                            Name: ${user_name}
                            <br>
                            Email: ${user_email}
                            <br>
                            Matriculation: ${user_matric}
                            <br>
                            Payment: ${fees_of_event}                
                            </div>
                            <button class="btn btn-warning center" data-bs-target="#addSuccessModal" data-bs-toggle= "modal">Confirm</button>
                        </div>
                        </div>
                        <div class="modal-footer">
                        <button class="btn btn-dark" data-bs-target="#event${event_id}" data-bs-toggle="modal">Go back</button>
                        </div>
                    </div>
                <!-- Modal -->

                </div>
                </div>
                <a class="btn btn-dark" data-bs-toggle="modal" href="#event${event_id}" role="button">More info</a>
            
            </div>
            </div>`
            }
    }}
    document.getElementById('for_you').innerHTML = tempHTML
}

// //ADD EVENT TO FIREBASE
// function AddEvent() {
//     id_event = document.getElementById("name")
// 	let toAdd = ""
// 	let toAddLength = toAdd.length
// 	for (let i = 0; i < toAddLength; i ++) {
// 		// console.log(toAdd[i].id);
// 		for (let union in clubsObj) {
// 			if (Object.hasOwnProperty.call(clubsObj, union)) {
// 				let unionClubs = clubsObj[union]
// 				// console.log(unionClubs);
// 				for (let cca in unionClubs) {
// 					if (Object.hasOwnProperty.call(unionClubs, cca)) {
// 						let ccaDetails = unionClubs[cca]
// 						let ccaId = ccaDetails["ccaId"]
// 						if (ccaId == toAdd[i].id) {
							
// 							interested_clubs[union][cca] = ccaDetails
// 							interestedArr.push(cca)
							
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
// 	console.log(interested_clubs);


// 	const db = getDatabase();
// 	set(ref(db, 'users/' + "user1" + '/user_events'), {
// 		interested_clubs

// 	})

// 	console.log("change success");

	
// 	$('#add-club').modal('hide');
// 	$('#successModal').modal('show');
// 	populateUninterested()

// }


// POPULATE USER UPCOMING EVENTS
let user_upcoming_events = {}
onValue(users, (snapshot => {
	const data = snapshot.val(); // get the new value
	user_upcoming_events = data.user1.user_events
    UserUpcomingSchoolEvents()
}));

function UserUpcomingSchoolEvents () {
    let tempHTML = `
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
        console.log("UserUpcomingSchoolEvents")
		if (Object.hasOwnProperty.call(user_upcoming_events, event) && (counter <= 5)) {
            // || counter != user_upcoming_events.length)
            let name_of_event = user_upcoming_events[event].title
            let photo_of_event= user_upcoming_events[event].photo_url
            let date_of_event= user_upcoming_events[event].start
            let date_list = date_of_event.split("-")
            let day_of_event = date_list [2]
            let year_of_event= date_list [0]
            let month_of_event= date_list [1]
            // if(current_year<=year_of_event && current_month == month_of_event && current_day <= day_of_event){
                if (counter == "0"){
                    tempHTML += `
                    <div class="carousel-item active">
                    <img src="${photo_of_event}" class="d-block w-100" alt="..." height="300" width="600">
                    <div class="carousel-caption d-none d-md-block" style = "background-color: white; color: black; font-family: font-family: Georgia, 'Times New Roman', Times, serif">
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
                    <div class="carousel-caption d-none d-md-block" style = "background-color: white; color: black; font-family: Georgia, 'Times New Roman', Times, serif">
                        <h5>${name_of_event}</h5>
                        <p>${date_of_event}</p>
                    </div>
                    </div>
                    `
                }
                counter += 1
            // }
        }
    }
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
    console.log(tempHTML)
    document.getElementById('carousel_user_events').innerHTML = tempHTML
}