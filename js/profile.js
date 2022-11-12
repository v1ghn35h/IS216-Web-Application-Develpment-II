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
let genders = ["Male", "Female", "Others"]
let schools = ["CIS", "SOA", "LKCSOB", "SOE", "SCIS", "YPHSOL", "SOSS"]
onValue(users, (snapshot => {
    const data = snapshot.val(); 

    document.getElementById('save').addEventListener("click", updateUserInfo);

    userInfo = data.user1.user_profile_info
    

    preference = userInfo.preference_info.preference

    if (preference[0] == "") {
        preference.pop()
    }

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
            console.log(url);
            let picture_url = `url(${url})`

            const db = getDatabase();
            set(ref(db, 'users/' + "user1" + '/user_profile_info/profile_picture'), {
                picture_url
            })

            $('#successModal').modal('show');

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
    console.log(document.getElementById('imagePreview').style.backgroundImage);
    readURL(this);

    console.log(document.getElementById('imagePreview').style.backgroundImage);
});

function displayDetails() {
    for (let category in userInfo) {
        if (category != "profile_picture" && category != "preference" && category != "preference_info") {

            document.getElementById(category).placeholder = userInfo[category];
            document.getElementById(category).value = userInfo[category]

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
    console.log(userInfo["profile_picture"]["picture_url"]);


}


//////////////////////////////////////////////////
// UDPATE USER INFO
function updateUserInfo() {

    const db = getDatabase();
    set(ref(db, 'users/' + "user1" + '/user_profile_info'), {
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

    console.log("change success");

    $('#successModal').modal('show');

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

    if (preference.length == 0) {
        preference.push("")
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
    console.log(user_events);
    UserForYouEvents()
}));

function UserForYouEvents () {
    let tempHTML = ""
    let counter = 0
    for (let event in user_events) {
		if (Object.hasOwnProperty.call(user_events, event)) {
            console.log(event);
            let name_of_event = user_events[event].title
            let type_of_event = user_events[event].category
            let club_of_event = user_events[event].event_club
            let photo_of_event= user_events[event].photo_url
            let date_of_event= user_events[event].event_date
            let time_of_event= user_events[event].event_time
            let location_of_event= user_events[event].event_location
            let event_id= user_events[event].id
            let event_date= user_events[event].start.slice(0,10)
            let current_date = new Date().toJSON().slice(0, 10);
            // console.log(current_date, event_date);
            // console.log(current_date > event_date);
            if (current_date > event_date){
                counter += 1
				tempHTML += ` 
                <div class="card my-5 mx-3" >
                    <!-- start of card-->
                    <div id="${event_id}">
                        <div class="text-box" style ="height: 300px">
                            <div class="image-box">
                                <img src="${photo_of_event}" />
                            </div>
                            <div class="text-container">
                                <h5 class="card-title"> ${name_of_event} </h5>
                                <!-- SUBTITLE -->
                                <h6 class="card-subtitle mb-2 "> ${type_of_event} </h6>
                                <!-- BODY -->
                                <p class="card-text text-wrap">
                                    Date: ${date_of_event}
                                    <br>
                                    Time: ${time_of_event}
                                    <br>
                                    Club: ${club_of_event}
                                </p>
                                
                            </div>
                        </div>
                        <!-- more info -->
                        <div style="display:flex; align-content: flex-start; margin: 15px;">
                            <button type="button" class="btn details-btn mt-3 " data-bs-target="#${event_id}-modal"
                                data-bs-toggle="modal">More info</button>
                        </div>
                    </div>
                    <!-- end of card-->


                    <!-- Modal -->
                    <div class="modal fade" id="${event_id}-modal" tabindex="-1" aria-labelledby="InfoPageLabel"
                        aria-hidden="true">
                        <div class="modal-dialog modal-dialog-scrollable modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="InfoPageLabel">${club_of_event}</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="container p-2">
                                        <img src="${photo_of_event}"
                                            style="width:500px; height:250px" alt="..." class="center "/>
                                    </div>
                                    <p class="display-6 lead text-center">${name_of_event}</p>
                                    <hr>
                                    <div class="container">
                                        <p>testing text</p>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- END OF SIGN UP & MORE INFO -->
                </div> <!-- end of event div-->
                `
        }
    }}
    document.getElementById('past_events').innerHTML = tempHTML

    if (counter == 0) {
        document.getElementById('events_h2').innerText = "";
    }
}

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