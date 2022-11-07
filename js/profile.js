//////////////////////////////////////////////////
// SELECTION OF CLUBS
$(document).ready(function() {
    $(".club").submit(function() {
        let checked = $(":checkbox:checked").length
        if (checked === 0) {
          //   alert("Choose at least one Club");
        } else {
          //   alert("Selected Club(s) : " + checked);
            $(".club").submit(function(e) {
                return false;
            });
  
        }
  
    });
    $(".club").submit(function(e) {
        return false;
    });
});
  
  
//////////////////////////////////////////////////
// EDIT BUTTON
var incompleteTasksHolder = document.getElementById("details"); 
var editTask = function() {
    var listItem = this.parentNode;
    var editInput = listItem.querySelector("input[type=text]");
    var label = listItem.querySelector("label");
    var containsClass = listItem.classList.contains("editMode");
    if (containsClass) { label.innerText = editInput.value; 
    } else { editInput.value = label.innerText; }
    listItem.classList.toggle("editMode");
  }
var taskCompleted = function() {
    var listItem = this.parentNode;
    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);
}
var bindTaskEvents = function(taskListItem) {
    var editButton = taskListItem.querySelector("button.edit");
    editButton.onclick = editTask;
}
for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}
  
  
//////////////////////////////////////////////////
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
const clubs = ref(db, 'clubs')
  
  
//////////////////////////////////////////////////
// FIREBASE POPULATE DETAILS
let userInfo = {}
onValue(users, (snapshot => {
    const data = snapshot.val(); 

    userInfo = data.user1.user_profile_info
    for (let category in userInfo) {
        if (category != "profile_picture" && category != "preference") {
            document.getElementById(category).innerText = userInfo[category];
        }
    }
    document.getElementById('imagePreview').style.backgroundImage = userInfo["profile_picture"]
}));
  
  
//////////////////////////////////////////////////
// CHANGE IMAGE
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagePreview').css('background-image', 'url('+e.target.result +')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }

    // FIREBASE
    let file = input.files[0]
    
    const storage = getStorage();
    /** @type {any} */
    const metadata = {
    contentType: 'image/jpeg'
    };
    
    const storageRef = sref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    
    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        }, 
        (error) => {
            switch (error.code) {
            case 'storage/unauthorized':
                break;
            case 'storage/canceled':
                break;
            case 'storage/unknown':
                break;
            }
        }, 
    () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            });
        }
    );

    // DOWNLOAD
    const profileRef = sref(storage, `images/${file.name}`);
    
    // Get the download URL
    getDownloadURL(profileRef)
        .then((url) => {
            // UPDATE JSON WITH THIS URL
            console.log(url);
        })
        .catch((error) => {
            switch (error.code) {
                case 'storage/object-not-found':
                    break;
                case 'storage/unauthorized':
                    break;
                case 'storage/canceled':
                    break;
                case 'storage/unknown':
                    break;
            }
        });
    
}
$("#imageUpload").change(function() {
    readURL(this);
});


//////////////////////////////////////////////////
// UDPATE USER INFO
function updateUserInfo() {

    let editCollection = document.getElementsByClassName('editMode');
    console.log(editCollection);
    for (let i = editCollection.length - 1; i >= 0; i --) {
        let editItem = editCollection[i]
        console.log(editItem);
        let label = editItem.querySelector('label');
        let editInput = editItem.querySelector("input[type=text]")
        label.innerText = editInput.value
        editItem.classList.remove('editMode')
    }

    const db = getDatabase();
    set(ref(db, 'users/' + "user1" + '/user_profile_info'), {
        name: document.getElementById('name').innerText,
        username: document.getElementById('username').innerText,
        gender: document.getElementById('gender').innerText,
        birthday: document.getElementById('birthday').innerText,
        school: document.getElementById('school').innerText,
        email: document.getElementById('email').innerText,
        matric_no: document.getElementById('matric_no').innerText,
        phone_no: document.getElementById('phone_no').innerText, 
        profile_picture: document.getElementById('imagePreview').style.backgroundImage,

        preference: userInfo.preference
    })

    console.log("change success");

    $('#successModal').modal('show');

}
document.getElementById('save').addEventListener("click", updateUserInfo)


//////////////////////////////////////////////////
// FIREBASE POPULATE INTERESTED CLUBS
let interestedArr = []
let interested_clubs = {}
onValue(users, (snapshot => {
    const data = snapshot.val(); // get the new value

    let tempHTML = ""
    let userClubs = data.user1.user_clubs.interested_clubs
    interested_clubs = userClubs

    for (let union in userClubs) {
        if (Object.hasOwnProperty.call(userClubs, union)) {
            let unionClubs = userClubs[union];

            for (let club in unionClubs) {
                if (Object.hasOwnProperty.call(unionClubs, club)) {
                    interestedArr.push(club)
                    let clubDetails = unionClubs[club];

                    tempHTML += `
                    <div class="card border-0 club-card" style="width: 12rem; height: 260px;">
                        <div class="image-center" >
                            <img style="border-radius: 20px; height: 8rem; width: auto;" src="${clubDetails["photo"]}" class="card-img-top" alt="...">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title small-title">
                                <a href="${clubDetails["website"]}" target="_blank" class="stretched-link">
                                    ${club}
                                </a>
                            </h5>
                            <p class="text-muted">${union}</p>
                        </div>
                    </div>
                    `;
                }
            }
        }
    }
    // ADD BUTTON
    tempHTML += `
    <div class="card border-0" style="width: 12rem; height: 260px">
        <div class="image-center">
            <img style="border-radius: 50%; width: 8rem; " src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Circled_plus.svg/800px-Circled_plus.svg.png" class="card-img-top" alt="...">
        </div>
        <div class="card-body">
            <!-- modal -->
            <h5 class="card-title">
                <a id="add-button-link" href="#" data-bs-toggle="modal" data-bs-target="#add-club" class="stretched-link">
                    Add a Club
                </a>
            </h5>
            <p class="text-muted">Pick a club you are interested in</p>
        </div>
    </div>
    `

    document.getElementById('interested-club').innerHTML = tempHTML

}));

function populateUninterested() {
    let tempHTML = ""
    for (let union in club_data) {
        if (Object.hasOwnProperty.call(club_data, union)) {
            let unionClubs = club_data[union];

            if (unionClubs.length > 0) {
                tempHTML += `
                <h5>${union}</h5>
                `
            }

            for (let club in unionClubs) {
                if (Object.hasOwnProperty.call(unionClubs, club)) {
                    let clubDetails = unionClubs[club];
                    let ccaId = clubDetails["ccaId"]

                    // console.log(interestedArr.includes(club));

                    if (!interestedArr.includes(club)) {

                        let heading = `<h3>${union}</h3>`

                        if (!tempHTML.includes(heading)) {
                            tempHTML += heading
                        }

                        tempHTML += `
                        <input id="${ccaId}" type="checkbox" class="checked_clubs" name="checked_clubs" value="${ccaId}"/>
                        <label for="${ccaId}"> ${club} </label>
                        `
                    }
                }
            }
        }
    }

    document.getElementById('chooseClub').innerHTML = tempHTML
}


//////////////////////////////////////////////////
// FIREBASE POPULATE UNINTERESTED CLUBS
let clubsObj = {}
let club_data = {}
onValue(clubs, (snapshot => {
    const data = snapshot.val(); // get the new value

    
    clubsObj = data
    club_data = data
    
    populateUninterested()
}));


//////////////////////////////////////////////////
// UPDATE CLUB
function updateInterestedClubs() {

    let toAdd = document.querySelectorAll('.checked_clubs:checked')
    let toAddLength = toAdd.length
    for (let i = 0; i < toAddLength; i ++) {
        // console.log(toAdd[i].id);
        for (let union in clubsObj) {
            if (Object.hasOwnProperty.call(clubsObj, union)) {
                let unionClubs = clubsObj[union]
                // console.log(unionClubs);
                for (let cca in unionClubs) {
                    if (Object.hasOwnProperty.call(unionClubs, cca)) {
                        let ccaDetails = unionClubs[cca]

                        let ccaId = ccaDetails["ccaId"]

                        if (ccaId == toAdd[i].id) {
                            
                            interested_clubs[union][cca] = ccaDetails
                            interestedArr.push(cca)
                            
                        }
                    }
                }
            }
        }
    }
    console.log(interested_clubs);


    const db = getDatabase();
    set(ref(db, 'users/' + "user1" + '/user_clubs'), {
        interested_clubs

    })

    console.log("change success");

    
    $('#add-club').modal('hide');
    $('#successModal').modal('show');
    populateUninterested()

}
document.getElementById('add').addEventListener("click", updateInterestedClubs)

function checkUninterested() {
    let chooseClubElement = document.getElementById('chooseClub');
    console.log();
    alert("")
    let chooseClubText = chooseClubElement.innerText.trim()
    if (chooseClubText == "") {
        alert("no")
    }
}
// document.getElementById('add-button-link').addEventListener("click", checkUninterested);

let user_events = {}
onValue(users, (snapshot => {
    const data = snapshot.val(); // get the new value

    user_events = data.user1.user_events
    UserForYouEvents()
}));

function UserForYouEvents () {
    let tempHTML = ""
    console.log(user_events);
    for (let event in user_events) {
        console.log(event);
		if (Object.hasOwnProperty.call(user_events, event)) {
            let name_of_event = user_events[event].name
            let club_of_event = user_events[event].club
            let type_of_event= user_events[event].type
            let photo_of_event= user_events[event].photo
            let date_of_event= user_events[event].date
            let time_of_event= user_events[event].time
            let fees_of_event= user_events[event].fees
            let location_of_event= user_events[event].location
            let event_id= user_events[event].eventId
            if (true){
				tempHTML += ` 
                <div class="card mx-1" style="width: 18rem;">
                <!-- PLACE IMAGE ON TOP OF CARD -->
                <img src = ${photo_of_event} height = "125" class="card-img-top" alt="...">
                <!-- HEADER [can be added to h* elements]-->
                <div class="card-body">
                    <!-- TITLE -->
                    <h5 class="card-title text-wrap" id = "name">${name_of_event}</h5>  
                    <!-- SUBTITLE -->
                    <h6 class="card-subtitle mb-2 text-muted text-wrap">${club_of_event}</h6>
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
                <div class="modal fade" id="event${event_id}" tabindex="-1" aria-labelledby="event${event_id}Label" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable modal-lg">
                    <div class="modal-content">
                        <div class="modal-header text-wrap">
                            <h1 class="modal-title fs-5" id="event${event_id}">${name_of_event}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-wrap">
                            <div class="container">
                            <img src = "${photo_of_event}" width= "300px" height = "250px" alt="..." class="center">
                            </div>
                            
                            <div class="container text-break p-3 mt-3 fs-6">
                                test
                            </div>
                        </div>
                        <div class="modal-footer text-wrap">
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-dark" data-bs-target="#event${event_id}SignUpPage" data-bs-toggle="modal">Sign up now</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <a class="btn btn-dark" data-bs-toggle="modal" href="#event${event_id}" role="button">More info</a>
            </div>
            </div>`
        }
    }}
    document.getElementById('events').innerHTML = tempHTML
}