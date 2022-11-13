//////////////////////////////////////////////////
// EDIT PERSONAL INFORMATION
$(document).ready(function(){
	$('.js-edit, .js-save').on('click', function(){
  	var $form = $(this).closest('form');
  	$form.toggleClass('is-readonly is-editing');
    var isReadonly = $form.hasClass('is-readonly');
    $form.find('input,textarea,select').prop('disabled', isReadonly);
  });
});
  
  
//////////////////////////////////////////////////
// FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase, ref, onValue , set , get , query , orderByChild } from
"https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js"
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";


//////////////////////////////////////////////////
// FIREBASE VARIABLES
import ResolvedUID from "./login-common.js"
let current_user = ResolvedUID
// current_user = "user1"
console.log(current_user);


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
const all_user_events = ref(db, 'users/' + current_user + '/user_events') 

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
let genders = ["Male", "Female", "Others"]
let schools = ["CIS", "SOA", "LKCSOB", "SOE", "SCIS", "YPHSOL", "SOSS"]
onValue(users, (snapshot => {
    const data = snapshot.val(); 

    document.getElementById('save').addEventListener("click", formControl);

    userInfo = data[current_user].user_profile_info
    
    console.log(userInfo);

    preference = userInfo.preference_info.preference

    displayDetails()

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
            console.log('File available at', downloadURL);

            let picture_url = `url("${downloadURL}")`

            const db = getDatabase();
            set(ref(db, 'users/' + current_user + '/user_profile_info/profile_picture'), {
                picture_url
            })

            $('#successModal').modal('show');
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
    // console.log(document.getElementById('imagePreview').style.backgroundImage);
    readURL(this);

    // console.log(document.getElementById('imagePreview').style.backgroundImage);
});

function displayDetails() {
    for (let category in userInfo) {
        if (category != "profile_picture" && category != "preference_info") {

            if (userInfo[category] == "<Unknown>") {
                document.getElementById(category).placeholder = "";
                document.getElementById(category).value = ""
            } else {
                document.getElementById(category).placeholder = userInfo[category];
                document.getElementById(category).value = userInfo[category]
            }

        }
    }

    let gender = userInfo.gender
    let gender_html = ""
    for (const gender_item of genders) {
        if (gender_item == gender) {
            gender_html += `<option selected>${gender_item}</option>`
        } else {
            gender_html += `<option>${gender_item}</option>`
        }
    }
    document.getElementById('gender').innerHTML = gender_html


    let school = userInfo.school
    let school_html = ""
    for (const school_item of schools) {
        if (school_item == school) {
            school_html += `<option selected>${school_item}</option>`
        } else {
            school_html += `<option>${school_item}</option>`
        }
    }
    document.getElementById('school').innerHTML = school_html

    document.getElementById('imagePreview').style.backgroundImage = userInfo["profile_picture"]["picture_url"]
    // console.log(userInfo["profile_picture"]["picture_url"]);


}


//////////////////////////////////////////////////
// UDPATE USER INFO
function updateUserInfo() {

    console.log(userInfo);
    console.log(userInfo.preference_info);

    const db = getDatabase();
    set(ref(db, 'users/' + current_user + '/user_profile_info'), {
        name: document.getElementById('name').value,
        username: document.getElementById('username').value,
        gender: document.getElementById('gender').value,
        birthday: document.getElementById('birthday').value,
        school: document.getElementById('school').value,
        email: document.getElementById('email').value,
        matric_no: document.getElementById('matric_no').value,
        phone_no: document.getElementById('phone_no').value, 
        profile_picture: {"picture_url": document.getElementById('imagePreview').style.backgroundImage},
        // preference: userInfo.preference,
        preference_info: userInfo.preference_info
    })

    // console.log("change success");

    $('#successModal').modal('show');

}

function formControl() {

    let error_msg = ""

    if (document.getElementById('name').value == "") {
        error_msg += "Fill in your name \n"
    }

    if (document.getElementById('username').value == "") {
        error_msg += "Fill in your username \n"
    }

    if (document.getElementById('birthday').value == "") {
        error_msg += "Fill in your birthday \n"
    }

    if (document.getElementById('email').value == "") {
        error_msg += "Fill in your email \n"
    } else if (!document.getElementById('email').value.includes("@")) {
        error_msg += "Enter a valid email \n"
    } else if (document.getElementById('email').value.indexOf("@") == 0) {
        error_msg += "Enter a valid email \n"
    } else if (document.getElementById('email').value.indexOf("@") == document.getElementById('email').value.length - 1) {
        error_msg += "Enter a valid email \n"
    } else if ((document.getElementById('email').value.match(/@/g) || []).length > 1) {
        error_msg += "Enter a valid email \n"
    }


    if (document.getElementById('matric_no').value == "") {
        error_msg += "Fill in your matric no. \n"
    } else if (document.getElementById('matric_no').value.length != 8) {
        error_msg += "Enter a valid 8 digit matric no. \n"
    }

    if (document.getElementById('phone_no').value == "") {
        error_msg += "Fill in your phone no. \n"
    } else if (document.getElementById('phone_no').value.length != 8) {
        error_msg += "Enter a valid 8 digit phone no. \n"
    }

    if (error_msg != "") {
        var $form = $(this).closest('form');
        $form.toggleClass('is-readonly is-editing');
        var isReadonly = $form.hasClass('is-readonly');
        $form.find('input,textarea,select').prop('disabled', isReadonly);

        document.getElementById('error_msg').innerText = error_msg;

        $('#errorModal').modal('show');


        return
    }
    
    updateUserInfo()
}


//////////////////////////////////////////////////
// DISPLAY CATEGORIES
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
                    
                    <p class="card-title small-title add">
                        <a href="#add" id="${categories_obj[category]["id"]}" class="text-primary">
                            Add
                        </a>
                    </p>
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
                    
                    <p class="card-title small-title remove">
                        <a href="#remove" id="${categories_obj[category]["id"]}" class="text-muted " id="test">
                            Remove
                        </a>
                    </p>
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

    if (preference[0] == "preference") {
        preference.pop()
    }

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

    console.log(preference, "0");

    if (preference.length == 0) {
        preference = ["preference"]
    }

    console.log(preference, "after");

    // update database
    const db = getDatabase();
    set(ref(db, 'users/' + current_user + '/user_profile_info/preference_info'), {
        preference
    })

    console.log(userInfo);


}


//////////////////////////////////////////////////
// DISPLAY EVENTS
let user_events = {}
let user_events_original = {}
onValue(users, (snapshot => {
    const data = snapshot.val(); // get the new value

    user_events_original = data[current_user].user_events
    // console.log(user_events);
    // UserForYouEvents()

    // addClickMessage() 

    get(query(all_user_events, orderByChild("event_date"))).then((snapshot) => {
        let sort_date = []
    
        snapshot.forEach(childSnapshot => {
            sort_date.push(childSnapshot.val())
        })
        user_events = sort_date
    
        UserPastEvents()
    
        addClickMessage() 
    })

}));



function UserPastEvents () {
    let tempHTML = ""
    let counter = 0
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
    for (let event in user_events) {
		if (Object.hasOwnProperty.call(user_events, event)) {
            // console.log(event);
            if (typeof user_events[event].id != "number") {
                let name_of_event = user_events[event].title
                let type_of_event = user_events[event].category
                let club_of_event = user_events[event].event_club
                let photo_of_event= user_events[event].photo_url
                let date_of_event= user_events[event].event_date
                let time_of_event= user_events[event].event_time
                let date_arr = date_of_event.split("-")
                let day = date_arr[2]
                let month = num_to_month[date_arr[1]]
                let year = date_arr[0]

                // let location_of_event= user_events[event].event_location
                let event_id= user_events[event].id
                let event_date= user_events[event].start.slice(0,10)
                let current_date = new Date().toJSON().slice(0, 10);
                if (current_date > event_date){
                    counter += 1
                    tempHTML += ` 
                    <div class="card my-5 mx-3" >
                        <!-- start of card-->
                        <div id="${event_id}">
                            <div class="text-box" style ="height: 320px">
                                <div class="image-box">
                                    <img src="${photo_of_event}" />
                                </div>
                                <div class="text-container">
                                    <h5 class="card-title text-wrap"> ${name_of_event} </h5>
                                    <!-- SUBTITLE -->
                                    <h6 class="card-subtitle mb-2 "> ${type_of_event} </h6>
                                    <!-- BODY -->
                                    <p class="card-text text-wrap">
                                        Date: ${day} ${month} ${year} 
                                        <br>
                                        Time: ${time_of_event}
                                        <br>
                                        Club: ${club_of_event}
                                    </p>
                                    
                                </div>
                            </div>
                            <!-- more info -->
                            <div style="display:flex; align-content: flex-start; margin: 15px;">
                                <button type="button" id="button_${event_id}" class="btn details-btn mt-3 " data-bs-target="#modal-${event_id}"
                                    data-bs-toggle="modal">More info</button>
                            </div>
                        </div>
                        <!-- end of card-->
                    </div> <!-- end of event div-->
                    `

                    // START OF MODEL
                    tempHTML += `
                    <div class="modal fade" id="modal-${event_id}" tabindex="-1" aria-labelledby="InfoPageLabel"
                            aria-hidden="true">
                            <div class="modal-dialog modal-dialog-scrollable modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="InfoPageLabel">${club_of_event}</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                    `

                    if (Object.hasOwnProperty.call(user_events[event], "event_msg")) {
                        let event_msg = user_events[event].event_msg.msg
                        if (event_msg != "") {
                            tempHTML += `
                                        <div class="modal-body" id="modal-body-${event_id}">
                                            <div class="container p-2">
                                                <img src="${photo_of_event}"
                                                    style="width:500px; height:250px" alt="..." class="center "/>
                                            </div>
                                            <p class="display-6 lead text-center">${name_of_event}</p>
                                            <hr>
                                            <div class="container">
                                                <p id="p_msg_${event_id}" class="text-wrap">${event_msg}</p>
                                                <textarea id="textarea_msg_${event_id}" style="display: none" class="form-control" placeholder="${event_msg}"></textarea>
                                            </div>
                                            
                                        </div>
                                        <div class="modal-footer">
                                        <button type="button" id="edit_msg_${event_id}" class="btn">Edit</button>
                                        <button style="display: none" type="button" id="save_msg_${event_id}" class="btn">Save</button>
                                        </div>     
                            `
                        } else {
                            tempHTML += `
                                        <div class="modal-body">
                                            <div class="container p-2">
                                                <img src="${photo_of_event}"
                                                    style="width:500px; height:250px" alt="..." class="center "/>
                                            </div>
                                            <p class="display-6 lead text-center">${name_of_event}</p>
                                            <hr>
                                            <div class="container">
                                                <p><textarea id="textarea_${event_id}" class="form-control" placeholder="Type your message here..."></textarea></p>
                                                
                                            </div>
                                            
                                        </div>
                                        <div class="modal-footer">
                                        <button type="button" id="add_msg_${event_id}" class="btn">Add</button>
                                        </div>
                            `  
                        }
                    } else {
                        tempHTML += `
                                    <div class="modal-body">
                                        <div class="container p-2">
                                            <img src="${photo_of_event}"
                                                style="width:500px; height:250px" alt="..." class="center "/>
                                        </div>
                                        <p class="display-6 lead text-center">${name_of_event}</p>
                                        <hr>
                                        <div class="container">
                                            <p><textarea id="textarea_${event_id}" class="form-control" placeholder="Type your message here..."></textarea></p>
                                            
                                        </div>
                                        
                                    </div>
                                    <div class="modal-footer">
                                    <button type="button" id="add_msg_${event_id}" class="btn">Add</button>
                                    </div>
                                
                        `
                    }

                    tempHTML += `
                                </div>
                            </div>
                        </div>
                    `
                }
                
            }

    }}

    if (counter == 0) {
        console.log(counter);
        document.getElementById('events-tab-pane').innerHTML = `
        <div id="sign_up">
            <div style="padding-top: 25%">
                <h2>You do not have past events</h2>
                <br>
                <h3>Sign up now!</h3>
                <br>
                <a class="btn" href="home.html">Home</a>
                <span> &nbsp; &nbsp; </span>
                <a class="btn" href="explore.html">Events</a>
            </div>
        </div>
        ` 
    } else {
        document.getElementById('past_events').innerHTML = tempHTML

    }

}


//////////////////////////////////////////////////
// ADD EVENT LISTENER
function addClickMessage() {
    for (let event in user_events_original) {
        if (Object.hasOwnProperty.call(user_events_original, event)) {

            if (typeof user_events_original[event].id != "number") {
                if (!Object.hasOwnProperty.call(user_events_original[event], "event_msg")) {

                    let event_date= user_events_original[event].start.slice(0,10)
                    let current_date = new Date().toJSON().slice(0, 10);
                    if (current_date > event_date){

    
                        let event_id = user_events_original[event]["id"]
                        document.getElementById(`add_msg_${event_id}`).addEventListener("click", function() {addMessage(this)} )
                    }
                } else if (user_events_original[event]["event_msg"]["msg"] == "") {
                    let event_date= user_events_original[event].start.slice(0,10)
                    let current_date = new Date().toJSON().slice(0, 10);
                    if (current_date > event_date){
    
                        let event_id = user_events_original[event]["id"]
                        document.getElementById(`add_msg_${event_id}`).addEventListener("click", function() {addMessage(this)} )
                    }
                } else {
                    let event_date= user_events_original[event].start.slice(0,10)
                    let current_date = new Date().toJSON().slice(0, 10);
                    if (current_date > event_date){
    
                        let event_id = user_events_original[event]["id"]
                        document.getElementById(`edit_msg_${event_id}`).addEventListener("click", function() { displayEdit(this)} )
                        document.getElementById(`save_msg_${event_id}`).addEventListener("click", function() { displayEdited(this)} )
                    }             
                }
            }
        }
    }
}


//////////////////////////////////////////////////
// EDITING OF MORE INFO
function displayEdit(ele) {
    let event_id = ele.id.split("_")[2]
    document.getElementById(`p_msg_${event_id}`).style.display = "none"
    document.getElementById(`textarea_msg_${event_id}`).style = ""
    document.getElementById(`edit_msg_${event_id}`).style.display = "none"
    document.getElementById(`save_msg_${event_id}`).style = ""

}

function displayEdited(ele) {
    let event_id = ele.id.split("_")[2]
    document.getElementById(`p_msg_${event_id}`).style = ""
    document.getElementById(`textarea_msg_${event_id}`).style.display = "none"
    document.getElementById(`edit_msg_${event_id}`).style = ""
    document.getElementById(`save_msg_${event_id}`).style.display = "none"

    let msg = document.getElementById(`textarea_msg_${event_id}`).value
    let event_key = ""

    for (let event in user_events_original) {
        if (user_events_original[event]["id"] == event_id) {
            event_key = event
        }
    }

    $(`#modal-${event_id}`).modal('hide')
    $('#successModal').modal('show');

    const db = getDatabase();
    set(ref(db, 'users/' + current_user + '/user_events/' + event_key + '/event_msg' ), {
        msg
    })

    // console.log("success");
}

function addMessage(ele) {
    let event_id = ele.id.split("_")[2]
    let msg = document.getElementById(`textarea_${event_id}`).value
    let event_key = ""

    // console.log(user_events);
    for (let event in user_events_original) {
        if (user_events_original[event]["id"] == event_id) {
            event_key = event
        }
    }

    
    $(`#modal-${event_id}`).modal('hide')
    $('#successModal').modal('show');

    const db = getDatabase();
    set(ref(db, 'users/' + current_user + '/user_events/' + event_key + '/event_msg' ), {
        msg
    })

    // console.log("success");
}


//////////////////////////////////////////////////
// TABS STYLE
function setButtonColor(elem) {
    let info_btn = document.getElementById("info-tab")
    let preference_btn =  document.getElementById("preference-tab")
    let events_btn = document.getElementById("events-tab")
    
    // reset color and background color of both
    info_btn.style.removeProperty("color")
    info_btn.style.removeProperty("background-color")
    preference_btn.style.removeProperty("color")
    preference_btn.style.removeProperty("background-color")
    events_btn.style.removeProperty("color")
    events_btn.style.removeProperty("background-color")
    
    // set color of selected element
    elem.style.color = "white"
    elem.style.backgroundColor = "#104547"
}

document.getElementById('info-tab').addEventListener("click", function () { setButtonColor(this); })
document.getElementById('preference-tab').addEventListener("click", function () { setButtonColor(this); })
document.getElementById('events-tab').addEventListener("click", function () { setButtonColor(this); })