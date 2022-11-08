//////////////////////////////////////////////////
// EDIT PERSONAL INFORMATION
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
const categories = ref(db, 'categories')


//////////////////////////////////////////////////
// FIREBASE GET categories
let categories_obj = {} // stores all categories available
let categories_arr = [] // stores all categories available
onValue(categories, (snapshot => {
    const data = snapshot.val(); 

    categories_obj = data
    for (const cat in categories_obj) {
        categories_arr.push(cat)
    }

}));  
  

//////////////////////////////////////////////////
// FIREBASE POPULATE DETAILS
let userInfo = {}
let preference = []
onValue(users, (snapshot => {
    const data = snapshot.val(); 

    userInfo = data.user1.user_profile_info
    for (let category in userInfo) {
        if (category != "profile_picture" && category != "preference" && category != "preference_info") {
            document.getElementById(category).innerText = userInfo[category];
        }
    }
    document.getElementById('imagePreview').style.backgroundImage = userInfo["profile_picture"]

    preference = userInfo.preference_info.preference

    displayCategories()

    for (const category in categories_obj) {
        const cat_id = categories_obj[category]["id"];

        document.getElementById(cat_id).addEventListener("click", function () { updatePreference(cat_id); })
    }

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
            // console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    // console.log('Upload is paused');
                    break;
                case 'running':
                    // console.log('Upload is running');
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
            // console.log('File available at', downloadURL);
            });
        }
    );

    // DOWNLOAD
    const profileRef = sref(storage, `images/${file.name}`);
    
    // Get the download URL
    getDownloadURL(profileRef)
        .then((url) => {
            // UPDATE JSON WITH THIS URL
            // console.log(url);
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

    // getting input fields
    let editCollection = document.getElementsByClassName('editMode');
    // console.log(editCollection);
    for (let i = editCollection.length - 1; i >= 0; i --) {
        let editItem = editCollection[i]
        // console.log(editItem);
        let label = editItem.querySelector('label');
        let editInput = editItem.querySelector("input[type=text]")
        label.innerText = editInput.value
        editItem.classList.remove('editMode')
    }

    // updating database
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

        // preference: userInfo.preference,
        preference_info: userInfo.preference_info
    })

    // console.log("change success");

    $('#successModal').modal('show');

}
document.getElementById('save').addEventListener("click", updateUserInfo)


function displayCategories() {
    let tempHTML = ""
    for (const category in categories_obj) {
        if (! preference.includes(category)) {
            tempHTML += `
            <div class="card border-0 club-card" style="width: 12rem; height: 220px;">
                <div class="image-center" >
                    <img style="height: 8rem; width: auto;" src="${categories_obj[category]["bw_photo_url"]}" class="card-img-top" alt="...">
                </div>
                <div class="card-body">
                    <h5 class="card-title small-title">
                        ${category}
                    </h5>
                    
                    <h6 class="card-title small-title ">
                        <a href="#add" id="${categories_obj[category]["id"]}" class="text-muted">
                            Add
                        </a>
                    </h6>
                </div>
            </div>
            `;
        } else {
            tempHTML += `
            <div class="card border-0 club-card" style="width: 12rem; height: 220px;">
                <div class="image-center" >
                    <img style="height: 8rem; width: auto;" src="${categories_obj[category]["photo_url"]}" class="card-img-top" alt="...">
                </div>
                <div class="card-body">
                    <h5 class="card-title small-title">
                        ${category}
                    </h5>
                    
                    <h6 class="card-title small-title ">
                        <a href="#remove" id="${categories_obj[category]["id"]}" class="text-muted" id="test">
                            Remove
                        </a>
                    </h6>
                </div>
            </div>
            `;
        }

    }
    document.getElementById('preference').innerHTML = tempHTML
}



//////////////////////////////////////////////////
// UPDATE PREFERENCE
function updatePreference(cat_id) {

    for (const category in categories_obj) {

        if (categories_obj[category]["id"] == cat_id) {

            if (preference.includes(category)) {
                // remove from arr
                let index = preference.indexOf(category)
                preference.splice(index, 1)
            } else {
                preference.push(category)
            }
        }
            
    }

    // update database
    const db = getDatabase();
    set(ref(db, 'users/' + "user1" + '/user_profile_info/preference_info'), {
        preference
    })

}


let user_events = {}
onValue(users, (snapshot => {
    const data = snapshot.val(); // get the new value

    user_events = data.user1.user_events
    // UserForYouEvents()
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