// ----------------------------------------
// CALENDAR FIREBASE

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

/* CONNECT TO DATABASE */
// Import functions needed to read from realtime database
import { getDatabase, ref, onValue, set, remove } from
"https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js"

// Connect to the realtime database
const db = getDatabase();

let all_events = []
let current_user = "user1" // change according to user logged in

let max_id = 0

// ----------------------------------------
// TO DO LIST
// Problem: User interaction doesn't provide desired results.
// Solution: Add interactivity so the user can manage daily tasks

var taskInput = document.getElementById("new-task");
var addButton = document.getElementsByTagName("button")[1];
var incompleteTasksHolder = document.getElementById("incomplete-tasks");
var completedTasksHolder = document.getElementById("completed-tasks");

//New Task List Item
var createNewTaskElement = function(taskString) {
  //Create List Item
  var listItem = document.createElement("li");

  //input (checkbox)
  var checkBox = document.createElement("input"); // checkbox
  //label
  var label = document.createElement("label");
  //input (text)
  var editInput = document.createElement("input"); // text
  //button.edit
  var editButton = document.createElement("button");
  //button.delete
  var deleteButton = document.createElement("button");
  
      //Each element needs modifying
  
  checkBox.type = "checkbox";
  editInput.type = "text";
  
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  
  label.innerText = taskString;
  
    
      // each element needs appending
  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
}

// Add a new task
var addTask = function() {
  console.log("Add task...");
  //Create a new list item with the text from #new-task:
  var listItem = createNewTaskElement(taskInput.value);
  //Append listItem to incompleteTasksHolder
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);  
  
  taskInput.value = "";   
}

// Edit an existing task
var editTask = function() {
  console.log("Edit Task...");
  
  var listItem = this.parentNode;
  
  var editInput = listItem.querySelector("input[type=text]")
  var label = listItem.querySelector("label");
  
  var containsClass = listItem.classList.contains("editMode");
    //if the class of the parent is .editMode 
  if(containsClass) {
      //switch from .editMode 
      //Make label text become the input's value
    label.innerText = editInput.value;
  } else {
      //Switch to .editMode
      //input value becomes the label's text
    editInput.value = label.innerText;
  }
  
    // Toggle .editMode on the parent
  listItem.classList.toggle("editMode");
 
}


// Delete an existing task
var deleteTask = function() {
  console.log("Delete task...");
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  
  //Remove the parent list item from the ul
  ul.removeChild(listItem);
}

// Mark a task as complete 
var taskCompleted = function() {
  console.log("Task complete...");
  //Append the task list item to the #completed-tasks
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
}

// Mark a task as incomplete
var taskIncomplete = function() {
  console.log("Task Incomplete...");
  // When checkbox is unchecked
  // Append the task list item #incomplete-tasks
  var listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
}

var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
  console.log("Bind list item events");
  //select taskListItem's children
  var checkBox = taskListItem.querySelector("input[type=checkbox]");
  var editButton = taskListItem.querySelector("button.edit");
  var deleteButton = taskListItem.querySelector("button.delete");
  
  //bind editTask to edit button
  editButton.onclick = editTask;
  
  //bind deleteTask to delete button
  deleteButton.onclick = deleteTask;
  
  //bind checkBoxEventHandler to checkbox
  checkBox.onchange = checkBoxEventHandler;
}

var ajaxRequest = function() {
  console.log("AJAX Request");
}

// Set the click handler to the addTask function
//addButton.onclick = addTask;
addButton.addEventListener("click", addTask);
addButton.addEventListener("click", ajaxRequest);


// Cycle over the incompleteTaskHolder ul list items
for(var i = 0; i <  incompleteTasksHolder.children.length; i++) {
    // bind events to list item's children (taskCompleted)
  bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}
// Cycle over the completeTaskHolder ul list items
for(var i = 0; i <  completedTasksHolder.children.length; i++) {
    // bind events to list item's children (taskIncompleted)
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete); 

}

// ----------------------------------------
// CALENDAR
// event icons & pictures
// {'category': [color, icon, image], ...}
let event_media = {'Adventure': ['#ffb700', 'icons/adventure.png'], 
                    'Arts': ['#ffc2d1', 'icons/artsculture.png', ''],
                    'Community': ['#ffd81a', 'icons/community.png'],
                    'Global': ['#ecbcfd', 'icons/globalculture.png'],
                    'School': ['#adc178', 'icons/schoolsociety.png'],
                    'Sports': ['#01497c', 'icons/sports.png'],
                    'Student': ['#8ecae6', 'icons/studentbodies.png']
                  }

/* colour picker */
var colors = [
  {
    name: 'Adventure',
    hex: '#ffb700',
  },
  {
    name: 'Arts & Culture',
    hex: '#ffc2d1',
  },
  {
    name: 'Community',
    hex: '#ffd81a',
  },
  {
    name: 'Global Culture',
    hex: '#ecbcfd',
  },
  {
    name: 'School Society',
    hex: '#adc178',
  },
  {
    name: 'Sports',
    hex: '#01497c',
  },
  {
    name: 'Student Bodies',
    hex: '#8ecae6',
  }
];

let event_class = ""
let event_color = ""

// Vue Instance
var apps = Vue.createApp({
    // Element
    el: "#category",

    // Data
    data() {
        return {
          active: false,
          selectedColor: '',
          selectedColorName: '',
          colors: colors
        }
    },

    // Methods
    methods: {

      selector: function() {
        if(!this.selectedColor) {
          return 'Select a category';
        }
        else {
          console.log('<span style="background: ' + this.selectedColor + '"></span>' + this.selectedColorName)
          return '<span style="background: ' + this.selectedColor + '"></span>' + this.selectedColorName;
        }
      },

      setColor: 
        function(color, colorName) {
        this.selectedColor = color;
        this.selectedColorName = colorName;
        this.active = false;

        // set global event class & color
        event_class = colorName
        event_color = color
      },

        toggleDropdown: function() {
          this.active = !this.active;
        }
    }
})

apps.mount("#category")


document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    customButtons: {
      // Click + button to add event
      addEvent: {
        text: '+',
        click: 
          function() {
            // get the modal
            var modal = document.getElementById("myModal");
            // get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];
          
            // when the user clicks on the button, open the modal
            modal.style.display = "block";
          
            // when the user clicks on <span> (x), close the modal
            span.onclick = function() {
              modal.style.display = "none";
            }
          
            // modal dropdown
            let ele = document.getElementById("selectElements")
          
            // when button is clicked
            document.getElementById('addEventButton').addEventListener("click", function() {
          
              // fetch start
              let start = document.getElementById('startDate').value
              let start_time = document.getElementById('startTime').value
              if (start_time != "") { // add start time if it's stated
                start += `T${start_time}:00`
              }
          
              // fetch end
              let end = ""
              let end_date = document.getElementById('endDate').value
              if (end_date != "") { // add end date if it is stated
                end += end_date
              }
              let end_time = document.getElementById('endTime').value
              if (end_time != "") { // add end time if it's stated
                end += `T${end_time}:00`
              }
              
              // add event to array
              set(ref(db, 'users/' + current_user + '/upcoming_events/event_' + 2), 
                {
                  title: document.getElementById('title').value,
                  start: start,
                  end: end,
                  category: event_class,
                  id: "3"
                },
              )

            // force page to reload
            setTimeout(function(){
              window.location.reload();
            }, 2000);
          
              // reset modal 
              modal.style.display = "none";
              document.getElementById("addEvent").reset();
            }
          )}
      }
    },

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'addEvent dayGridMonth,listYear',
    },

    themeSystem: 'bootstrap5',

    displayEventTime: true,

    firstDay: 1, // set first day of week to monday

    // Click on date (to add event)
    dateClick: 
      function (info) {

        // get the modal
        var modal = document.getElementById("myModal");
        // get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // when the user clicks on the button, open the modal
        modal.style.display = "block";

        // when the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = "none";
        }

        // modal dropdown
        let ele = document.getElementById("selectElements")

        var dateStr = info.dateStr

        // set HTML input value as date selected
        let date_selected = document.getElementById("startDate")
        date_selected.value = dateStr

        // when button is clicked
        document.getElementById('addEventButton').addEventListener("click", function() {

          // fetch start
          let start = document.getElementById('startDate').value
          let start_time = document.getElementById('startTime').value
          if (start_time != "") { // add start time if it's stated
            start += `T${start_time}:00`
          }

          // fetch end
          let end = ""
          let end_date = document.getElementById('endDate').value
          if (end_date != "") { // add end date if it is stated
            end += end_date
          }
          let end_time = document.getElementById('endTime').value
          if (end_time != "") { // add end time if it's stated
            end += `T${end_time}:00`
          }
          
          // add event to array
          // TO CHANGE!!!
          calendar.addEvent(
            {
              title: document.getElementById('title').value,
              start: start,
              end: end,
              className: event_class,
              backgroundColor: event_color,
              borderColor: event_color,
            },
          )

          // reset modal 
          modal.style.display = "none";
          document.getElementById("addEvent").reset();
        })
        
      },


    // API Key
    googleCalendarApiKey: 'AIzaSyC4IyTr17PyenYfQSiFD3mI3xCGIV0LsOk',
    // old: AIzaSyBLxGXn-ZzMfSKIobD-6C4chf4qI8XXRn8

    events: 
      function(info, successCallback, failureCallback) {

      // Get a reference to the data 'title'
      const users = ref(db, 'users') 

      // Update user's calendar
      onValue(users, (snapshot => {
        const data = snapshot.val(); // get the new value

        let all_users = data
        let user = data[current_user]

        let upcoming_events = user.upcoming_events

        for (let event in upcoming_events) {
          let new_event_obj = upcoming_events[event]

          // set event color by category
          let new_event_category = new_event_obj.category
          let find_object = colors.find(o => o.name === new_event_category); // find object with the name == new_event_category
          let new_event_color = find_object.hex


          // add color to event object
          new_event_obj["color"] = new_event_color
          all_events.push(new_event_obj)
        }

        successCallback(all_events)

      }));

    },

    // When the user clicks on an event
    eventClick: 
      function(info) {

        let event_info = info.event._def

        // get the modal
        var modal = document.getElementById("myOtherModal");
        var success_modal = document.getElementById("deleteSuccessModal");

        // get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[1];

        // when the user clicks on the button, open the modal
        modal.style.display = "block";
        success_modal.style.display = "none";

        // when the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = "none";
        }

        // --- DISPLAY EVENT DETAILS ---
        let event_id = event_info.publicId
        let event_category = info.event._def.extendedProps.category

        // set color based on category
        let event_colour = info.event._def.ui.backgroundColor
        let dot = document.getElementById("eventColor")
        dot.style.background = event_colour

        // if event_category is selected, set icon based on category
        if (event_category != undefined) {
          let event_icon = event_media[event_category][1]
          let icon = document.getElementById("eventIcon")
          icon.innerHTML = `<img src="img/${event_icon}" style='height: 50px;'>`
        }

        // set event title
        let eventTitle = document.getElementById("eventTitle")
        eventTitle.innerHTML = info.event._def.title

        // set event start details
        let eventStart = document.getElementById("eventStart")
        let start = info.event.start
        let start_string = String(start)
        let start_arr = start_string.split(" ")
        let start_day = start_arr[0]
        let start_month = start_arr[1]
        let start_date = start_arr[2]
        let start_year = start_arr[3]
        let start_time = start_arr[4].slice(0,5)
        let start_output = `${start_date} ${start_month} ${start_year} (${start_day}), ${start_time}`
        eventStart.innerHTML = start_output

        // set event end details
        let eventEnd = document.getElementById("eventEnd")
        let end = info.event.end
        let end_output = "-"
        if (end != null) { // if end date is specified
          let end_string = String(end)
          let end_arr = end_string.split(" ")
          let end_day = end_arr[0]
          let end_month = end_arr[1]
          let end_date = end_arr[2]
          let end_year = end_arr[3]
          let end_time = end_arr[4].slice(0,5)
          end_output = `${end_date} ${end_month} ${end_year} (${end_day}), ${end_time}`
        }
        eventEnd.innerHTML = end_output

        // set event category
        let eventCategory = document.getElementById("eventCategory")
        if (event_category != undefined) {
          eventCategory.innerHTML = event_category
        }
        else {
          eventCategory = "Not specified"
        }

        // --- DELETE EVENT ---
        document.getElementById('deleteEventButton').onclick = 
        function() {
          console.log("button was clicked");

          // Fetch event
          let event_to_delete = calendar.getEventById(Number(event_id))

          // Delete event
          const tasksRef = ref(db, 'users/user1/upcoming_events/event_' + event_id);

          remove(tasksRef).then(() => {
            console.log(tasksRef)
            success_modal.style.display = "block";
            // force page to reload
            setTimeout(function(){
              window.location.reload();
              }, 2000);
          });

      };
    }

  });

  calendar.render();
});