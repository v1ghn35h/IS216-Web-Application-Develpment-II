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
var app = Vue.createApp({
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

app.mount("#category")


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

    // Events from database (google calendar)
    eventSources: [
      {
        googleCalendarId:'d55701d01ba1038768a0a98fba868aab7e3ce8954f4a78a63d4970026c34d4a2@group.calendar.google.com',
        className: 'Adventure',
        color: '#ffb700' // orange
      },
      {
        googleCalendarId:'7a9df4f985d4443d3711619daf830984c0382e2b7dc9f2a3af052d96347fe077@group.calendar.google.com',
        className: 'Arts & Culture',
        color: '#ffc2d1' // pink
      },
      {
        googleCalendarId:'bfbe99ec974a40336137e144b240bc6c0638f50120390e989db68dbaf6febc83@group.calendar.google.com',
        className: 'Community',
        color: '#ffd81a' // yellow
      },
      {
        googleCalendarId:'34e6e342a1a4f0fac2dc4c3b018d8fc49fc4408fe7c339767f56732c7759407c@group.calendar.google.com',
        className: 'Global Culture',
        color: '#ecbcfd' // purple
      },
      {
        googleCalendarId:'835cd39d1fefa4b47d0967c3049bd4e68676f5f08143e14dbd42ec97f0e9237e@group.calendar.google.com',
        className: 'School Society',
        color: '#adc178' // green
      },
      {
        googleCalendarId:'f10659566b954502d50d0e59720982c28b6a17ffe79492e393cf6fb4566be0c2@group.calendar.google.com',
        className: 'Sports',
        color: '#01497c' // dark blue
      },
      {
        googleCalendarId:'432fd38ca06006129addbc65d3ec1bc80260681f26bffed41e5e69d5c822ad57@group.calendar.google.com',
        className: 'Student Bodies',
        color: '#8ecae6' // light blue
      }
    ],

    // To populate new events
    events: [
      // test event
      {
        title: 'test adventure',
        start: '2022-10-16',
        className: 'Adventure',
        color: '#ffb700' // orange
      },
      {
        title: 'test arts',
        start: '2022-10-17',
        className: 'Arts & Culture',
        color: '#ffc2d1' // pink
      },
      {
        title: 'test community',
        start: '2022-10-18',
        className: 'Community',
        color: '#ffd81a' // yellow
      },
      {
        title: 'test global culture',
        start: '2022-10-19',
        className: 'Global Culture',
        color: '#ecbcfd' // purple
      },
      {
        title: 'test school society',
        start: '2022-10-20',
        className: 'School Society',
        color: '#adc178' // green
      },
      {
        title: 'test sports',
        start: '2022-10-21',
        className: 'Sports',
        color: '#01497c' // dark blue
      },
      {
        title: 'test student bodies',
        start: '2022-10-22',
        className: 'Student Bodies',
        color: '#8ecae6' // light blue
      }
    ],

    // When the user clicks on an event
    eventClick: 
      function(info) {
        // get the modal
        var modal = document.getElementById("myOtherModal");
        // get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[1];

        // when the user clicks on the button, open the modal
        modal.style.display = "block";

        // when the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = "none";
        }

        // output event details
        let event_category = info.event._def.ui.classNames[0]

        // set color based on category
        let event_colour = event_media[event_category][0]
        let dot = document.getElementById("eventColor")
        dot.style.background = event_colour

        // set icon based on category
        let event_icon = event_media[event_category][1]
        let icon = document.getElementById("eventIcon")
        icon.innerHTML = `<img src="img/${event_icon}" style='height: 50px;'>`

        // set event title
        let eventTitle = document.getElementById("eventTitle")
        eventTitle.innerHTML = info.event.title

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
        eventCategory.innerHTML = info.event._def.ui.classNames[0]

      }

  });

  calendar.render();
});