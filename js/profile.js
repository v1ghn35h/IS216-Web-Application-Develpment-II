//////////////////////////////////////////////////
// SELECTION OF CLUBS
$(document).ready(function() {
  $(".country").submit(function() {
      let checked = $(":checkbox:checked").length
      if (checked === 0) {
          alert("Choose at least one Country");
      } else {
          alert("Selected Countries : " + checked);
          $(".country").submit(function(e) {
              return false;
          });

      }

  });
  $(".country").submit(function(e) {
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


//////////////////////////////////////////////////
// FIREBASE POPULATE DETAILS
onValue(users, (snapshot => {
	const data = snapshot.val(); 

	let userInfo = data.user1.user_profile_info
	for (let category in userInfo) {
		if (category != "profile_picture") {
			document.getElementById(category).innerText = userInfo[category];
		}
	}
	document.getElementById('imagePreview').style.backgroundImage = userInfo["profile_picture"]
}));


//////////////////////////////////////////////////
// FIREBASE POPULATE INTERESTED CLUBS
onValue(users, (snapshot => {
	const data = snapshot.val(); // get the new value

	let tempHTML = ""
	let userClubs = data.user1.user_clubs

	for (let union in userClubs) {
		if (Object.hasOwnProperty.call(userClubs, union)) {
			let unionClubs = userClubs[union];

			for (let club in unionClubs) {
				if (Object.hasOwnProperty.call(unionClubs, club)) {
					let clubDetails = unionClubs[club];

					tempHTML += `
					<div class="card border-0" style="width: 15rem; height: 260px;">
						<div class="image-center" >
							<img style="border-radius: 50%; height: 8rem; width: auto;" src="${clubDetails["photo"]}" class="card-img-top" alt="...">
						</div>
						<div class="card-body">
							<h5 class="card-title">
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
	<div class="card border-0" style="width: 15rem; height: 260px">
		<div class="image-center">
			<img style="border-radius: 50%; width: 8rem; " src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Circled_plus.svg/800px-Circled_plus.svg.png" class="card-img-top" alt="...">
		</div>
		<div class="card-body">
			<!-- modal -->
			<h5 class="card-title">
				<a href="#" data-bs-toggle="modal" data-bs-target="#add-club" class="stretched-link">
					Add a Club
				</a>
			</h5>
			<p class="text-muted">Pick a club you are interested in</p>
		</div>
	</div>
	`

	document.getElementById('interested-club').innerHTML = tempHTML

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


// function res(item) {
// 	console.log(item);
// 	console.log("im in");
// 	console.log(item.value);
// }
// document.getElementById("myBtn").addEventListener("click", res(this));


// function writeUserData(userId, name, username, gender, birthday, email, matric_no, phone_no) {
// 	const db = getDatabase();
// 	set(ref(db, 'users/' + userId + '/user_profile_info'), {
// 		name: name,
// 		username: username,
// 		gender: gender,
// 		birthday: birthday,
// 		email: email,
// 		matric_no: matric_no,
// 		phone_no: phone_no

// 	});

// 	console.log("Im in");
// }

// const apps = Vue.createApp({
// 	el: "#info",

//     // Data Properties
//     data() {
//         return {

// 			name: "Natasha",
// 			username: "",
// 			gender: "",
// 			birthday: "",
// 			email: "",
// 			matric_no: "",
// 			phone_no: "",

//         }
//     },

//     methods: {

// 		writeUserData(userId, name, username, gender, birthday, email, matric_no, phone_no) {
// 			const db = getDatabase();
// 			set(ref(db, 'users/' + userId + '/user_profile_info'), {
// 				name: name,
// 				username: username,
// 				gender: gender,
// 				birthday: birthday,
// 				email: email,
// 				matric_no: matric_no,
// 				phone_no: phone_no
		
// 			});
		
// 			console.log("Im in");
// 		}

//     }
// })


// // DO NOT MODIFY THIS
// apps.mount("#info")

// function writeUserData(userId, name, username, gender, birthday, email, matric_no, phone_no) {
// 	const db = getDatabase();
// 	set(ref(db, 'users/' + userId + '/user_profile_info'), {
// 		name: name,
// 		username: username,
// 		gender: gender,
// 		birthday: birthday,
// 		email: email,
// 		matric_no: matric_no,
// 		phone_no: phone_no

// 	})
// }

function writeUserData() {
	const db = getDatabase();
	set(ref(db, 'users/' + "user1" + '/user_profile_info'), {
		name: document.getElementById('name').innerText,
		username: document.getElementById('username').innerText,
		gender: document.getElementById('gender').innerText,
		birthday: document.getElementById('birthday').innerText,
		email: document.getElementById('email').innerText,
		matric_no: document.getElementById('matric_no').innerText,
		phone_no: document.getElementById('phone_no').innerText, 
		profile_picture: document.getElementById('imagePreview').style.backgroundImage

	})

	console.log("change success");
}

document.getElementById('save').addEventListener("click", writeUserData)