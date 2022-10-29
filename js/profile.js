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
	var incompleteTasksHolder = document.getElementById("details"); //incomplete-tasks

	//Edit an existing task
	var editTask = function() {
		var listItem = this.parentNode;
		var editInput = listItem.querySelector("input[type=text]");
		var label = listItem.querySelector("label");
		var containsClass = listItem.classList.contains("editMode");
		if (containsClass) { label.innerText = editInput.value; 
		} else { editInput.value = label.innerText; }
		listItem.classList.toggle("editMode");
	}

	//Mark a task as complete
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
// FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);


/* CONNECT TO DATABASE */
import { getDatabase, ref, onValue } from
"https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js"

const db = getDatabase();

// Get a reference to the data 'title'
const users = ref(db, 'users') 

// firebase console object syntax: { "creator": "Robin", "roomName": "Holy Robert Louis Stevenson" }

onValue(users, (snapshot => {
	const data = snapshot.val(); // get the new value
	// console.log(data);

	let userInfo = data.user1.user_profile_info
	// console.log(userInfo);
	// console.log(userInfo.name);

	for (let category in userInfo) {
		if (category != "profile_picture") {
			// console.log(category, userInfo[category]);
			document.getElementById(category).innerText = userInfo[category];
		}
	}
	// console.log(userInfo["profile_picture"]);
	// console.log(document.getElementById('imagePreview').style.backgroundImage );
	document.getElementById('imagePreview').style.backgroundImage = `url(${userInfo["profile_picture"]})`
}));

onValue(users, (snapshot => {
	const data = snapshot.val(); // get the new value

	// console.log(data);

	let userClubs = data.user1.user_clubs

	// console.log(userClubs);

	for (let union in userClubs) {
		if (Object.hasOwnProperty.call(userClubs, union)) {
			let unionClubs = userClubs[union];

			// console.log(unionClubs);

			for (let club in unionClubs) {
				if (Object.hasOwnProperty.call(unionClubs, club)) {
					let clubDetails = unionClubs[club];

					// console.log(clubDetails);

					document.getElementById('interested-club').innerHTML += `
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
	document.getElementById('interested-club').innerHTML += `
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

}));

//////////////////////////////////////////////////
// IMAGE

//////////////////////////////////////////////////
// CHANGE IMAGE
// function readURL(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//         reader.onload = function(e) {
//             $('#imagePreview').css('background-image', 'url('+e.target.result +')');
//             $('#imagePreview').hide();
//             $('#imagePreview').fadeIn(650);
//         }
//         reader.readAsDataURL(input.files[0]);
//     }

//     console.log("i'm in");

// 	file = input.files[0]
// }
// $("#imageUpload").change(function() {
//     readURL(this);
// });

import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

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

    console.log("i'm in");

	let file = input.files[0]
	
	const storage = getStorage();
	
	// Create the file metadata
	/** @type {any} */
	const metadata = {
	  contentType: 'image/jpeg'
	};
	
	// Upload file and metadata to the object 'images/mountains.jpg'
	const storageRef = sref(storage, 'images/' + file.name);
	const uploadTask = uploadBytesResumable(storageRef, file, metadata);
	
	// Listen for state changes, errors, and completion of the upload.
	uploadTask.on('state_changed',
	  (snapshot) => {
		// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
		// A full list of error codes is available at
		// https://firebase.google.com/docs/storage/web/handle-errors
		switch (error.code) {
		  case 'storage/unauthorized':
			// User doesn't have permission to access the object
			break;
		  case 'storage/canceled':
			// User canceled the upload
			break;
	
		  // ...
	
		  case 'storage/unknown':
			// Unknown error occurred, inspect error.serverResponse
			break;
		}
	  }, 
	  () => {
		// Upload completed successfully, now we can get the download URL
		getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
		  console.log('File available at', downloadURL);
		});
	  }
	);

	// DOWNLOAD
	// Create a reference to the file we want to download
	const profileRef = sref(storage, `images/${file.name}`);
	
	// Get the download URL
	getDownloadURL(profileRef)
	  .then((url) => {
		// UPDATE JSON WITH THIS URL
		console.log(url);
	  })
	  .catch((error) => {
		// A full list of error codes is available at
		// https://firebase.google.com/docs/storage/web/handle-errors
		switch (error.code) {
		  case 'storage/object-not-found':
			// File doesn't exist
			break;
		  case 'storage/unauthorized':
			// User doesn't have permission to access the object
			break;
		  case 'storage/canceled':
			// User canceled the upload
			break;
	
		  // ...
	
		  case 'storage/unknown':
			// Unknown error occurred, inspect the server response
			break;
		}
	  });
	
}
$("#imageUpload").change(function() {
    readURL(this);
});

