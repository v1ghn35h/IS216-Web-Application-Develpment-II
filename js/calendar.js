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
import { getDatabase, ref, onValue, child, get, set, remove, push, update } from
"https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js"

// Connect to the realtime database
const db = getDatabase();

var all_events = []
let current_user = "user1" // change according to user logged in

var all_tasks = []
var new_db_size = 0
var new_id = 0

// ----------------------------------------
// TO DO LIST

let task_list_div = document.getElementById("taskList")

// fetch data from db and populate tasks
const dbRef = ref(getDatabase());
get(child(dbRef, `users/${current_user}/user_tasks/`)).then((snapshot) => {
  if (snapshot.exists()) {
    let tasks = snapshot.val();
    all_tasks = tasks
    new_id = Object.keys(all_tasks).length

    // clear previous data
    task_list_div.innerHTML = ""

    for (var task in tasks) {
      let output = ``

      let task_info = tasks[task]

      let task_id = task_info.id
      let task_title = task_info.title
      let task_completion = task_info.status

      if (task_completion == "done") {
        output += `<li class="list-group-item done" id=${task_id}>`
      }
      else {
        output += `<li class="list-group-item" id=${task_id}>`
      }

      output += `<i class="far fa-square done-icon"></i>
                  <i class="far fa-check-square done-icon"></i>
                  <span class="todo-text"> ${task_title} </span>
                  <i class="far fa-trash-alt"></i>
                </li>`

      task_list_div.innerHTML += output
    }
  } 
  else {
    console.log("No data available");
  }
})


// Define all UI variable
const todoList = document.querySelector('.list-group');
const form = document.querySelector('#form');
const todoInput = document.querySelector('#todo');
const clearBtn = document.querySelector('#clearBtn');
const search = document.querySelector('#search');

// Load all event listners
allEventListners();


// Functions of all event listners
function allEventListners() {
    // Add todo event
    form.addEventListener('submit', addTodo);
    // Remove and complete todo event
    todoList.addEventListener('click', removeTodo);
}

// TO-DO ADD TO DB
function to_do_addDB(id, title, status) {
  set(ref(db, 'users/' + current_user + '/user_tasks/task_' + id), 
    {
      id: id,
      title: title,
      status: status
    }
  )

  // add to task obj
  all_tasks[`task_${id}`] = {"title": title, "status": status}
}

// TO-DO FETCH FROM DB
function to_do_fetchDB() {
  let num_ele = 0
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${current_user}/user_tasks/`)).then((snapshot) => {
    if (snapshot.exists()) {
      let tasks = snapshot.val();
      
      // update all_tasks arr
      all_tasks = tasks
    }
  })
}

// Add todo item function
function addTodo(e) {

    // fetch from database
    to_do_fetchDB()

    if (todoInput.value !== '') {
        // Create li element
        const li = document.createElement('li');
        // Add class
        li.className = 'list-group-item';
        // Add complete and remove icon
        li.innerHTML = `<i class="far fa-square done-icon"></i>
                        <i class="far fa-check-square done-icon"></i>
                        <i class="far fa-trash-alt"></i>`;
        // Create span element
        const span = document.createElement('span');
        // Add class
        span.className = 'todo-text';
        // Create text node and append to span
        span.appendChild(document.createTextNode(todoInput.value));
        // Append span to li
        li.appendChild(span);
        // Append li to ul (todoList)
        todoList.appendChild(li);

        // add to database
        new_id += 1
        console.log(new_id)
        let task_id = new_id
        let task_title = todoInput.value
        let task_status = ""

        to_do_addDB(task_id, task_title, task_status) 
        
        // Clear input
        todoInput.value = '';

        // refetch from database (to update contents)
        to_do_fetchDB()

    } else {
        alert('Please add todo');
    }

    e.preventDefault();
}


// Remove and complete todo item function
function removeTodo(e) {

    // fetch from database
    to_do_fetchDB()

    let event = e.target.parentElement
    let event_id = event.id

    let event_title = event.getElementsByClassName("todo-text")[0].innerHTML

    // Complete todo
    if (e.target.classList.contains('done-icon')) {
        e.target.parentElement.classList.toggle('done');

        let check = event.classList.contains('done')
        let status = ""
        
        // task completed
        if (check) {
          status = "done"
        }

        // task not completed
        else {
          status = ""
        }

    // re add data to DB
    to_do_addDB(event_id, event_title, status)

    // refetch from database (to update contents)
    to_do_fetchDB()

  }

    // Remove todo
    if (e.target.classList.contains('fa-trash-alt')) {
        if (confirm('Are you sure')) {
            e.target.parentElement.remove();

            // fetch from db
            to_do_fetchDB()

            // delete from db
            const tasksRef = ref(db, 'users/' + current_user + '/user_tasks/task_' + event_id);
            console.log(tasksRef)
            remove(tasksRef).then(() => {
            });

            // refetch from database (to update contents)
            to_do_fetchDB()

        }
    }
}


// ----------------------------------------
// CALENDAR
// event icons & pictures
// {'category': [color, icon, image], ...}
let event_media = {'Adventure': ['#ffb700', 'icons/adventure.png'], 
                    'Arts & Culture': ['#ffc2d1', 'icons/artsculture.png', ''],
                    'Community': ['#ffd81a', 'icons/community.png'],
                    'Global Culture': ['#ecbcfd', 'icons/globalculture.png'],
                    'School Society': ['#adc178', 'icons/schoolsociety.png'],
                    'Sports': ['#01497c', 'icons/sports.png'],
                    'Student Bodies': ['#8ecae6', 'icons/studentbodies.png']
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
  },
  {
    name: 'Academics',
    hex: '#ff8fab'
  },
  {
    name: 'Miscellaneous',
    hex: '#ced4da'
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
    height: 700,

    views: {
      eventLimit: 2, // for all non-TimeGrid views
    },

    customButtons: {
      // Click + button to add event
      addEvent: {
        text: '+',
        click: 
          function() {

            // get the modal
            var modal = document.getElementById("myModal");
            var add_success_modal = document.getElementById("addSuccessModal");

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

              // fetch title
              let title = document.getElementById('title').value
              console.log(title)
          
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

              // fetch items from db
              const dbRef = ref(getDatabase());
              get(child(dbRef, `users/${current_user}/user_events/`)).then((snapshot) => {
                if (snapshot.exists()) {
                  let db_values = snapshot.val();
                  let db_size = Object.keys(db_values).length
                  let new_db_size = db_size + 1
                } else {
                  console.log("No data available");
                }
              }).catch((error) => {
                console.error(error);
              });
              
              // add event to array
              set(ref(db, 'users/' + current_user + '/user_events/event_' + new_db_size), 
                {
                  title: title,
                  start: start,
                  end: end,
                  category: event_class,
                  id: new_db_size
                },
              )

              // display added successfully
              add_success_modal.style.display = "block";

              // force page to reload
              setTimeout(function(){
                window.location.reload();
              }, 2000);
          
              // reset modal 
              modal.style.display = "none";
              document.getElementById("addEvent").reset();
            }
          )}
      },

      // // disable month view when month button clicked
      // dayGridMonth: {
      //   text: 'Month',
      //   click: function() {
      //     alert('clicked the custom button!');
      //   }
      // },

      // listYear: {
      //   text: 'List',
      //   click: function() {
      //     alert('clicked the custom button!');
      //   }
      // },
    },

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'addEvent dayGridMonth,listYear',
    },

    buttonText: {
        today:    'Today',
        month:    'Month',
        week:     'Week',
        day:      'Day',
        list:     'List'
    },

    themeSystem: 'bootstrap5',

    displayEventTime: true,

    firstDay: 1, // set first day of week to monday

    // Click on date (to add event)
    dateClick: 
      function (info) {

        // get the modal
        var modal = document.getElementById("myModal");
        var add_success_modal = document.getElementById("addSuccessModal");
        // get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // when the user clicks on the button, open the modal
        modal.style.display = "block";
        add_success_modal.style.display = "none";

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
          var start = document.getElementById('startDate').value
          var start_time = document.getElementById('startTime').value
          if (start_time != "") { // add start time if it's stated
            start += `T${start_time}:00`
          }

          // fetch end
          var end = ""
          var end_date = document.getElementById('endDate').value
          if (end_date != "") { // add end date if it is stated
            end += end_date
          }
          var end_time = document.getElementById('endTime').value
          if (end_time != "") { // add end time if it's stated
            end += `T${end_time}:00`
          }
          
          // fetch title
          var title = document.getElementById('title').value
      
          // fetch start
          var start = document.getElementById('startDate').value
          var start_time = document.getElementById('startTime').value
          if (start_time != "") { // add start time if it's stated
            start += `T${start_time}:00`
          }
      
          // fetch end
          var end = ""
          var end_date = document.getElementById('endDate').value
          if (end_date != "") { // add end date if it is stated
            end += end_date
          }
          var end_time = document.getElementById('endTime').value
          if (end_time != "") { // add end time if it's stated
            end += `T${end_time}:00`
          }

          // fetch items from db
          const dbRef = ref(getDatabase());
          get(child(dbRef, `users/${current_user}/user_events/`)).then((snapshot) => {
            if (snapshot.exists()) {
              var db_values = snapshot.val();
              var db_size = Object.keys(db_values).length
              var new_db_size = db_size + 1

              // add event to array
              set(ref(db, 'users/' + current_user + '/user_events/event_' + new_db_size), 
                {
                  title: title,
                  start: start,
                  end: end,
                  category: event_class,
                  id: new_db_size
                },
              )

              // display added successfully
              add_success_modal.style.display = "block";

              // force page to reload
              setTimeout(function(){
                window.location.reload();
              }, 2000);
          
              // reset modal 
              modal.style.display = "none";
              document.getElementById("addEvent").reset();
            } 
            

            else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });
          
        }
    )},

    // API Key
    googleCalendarApiKey: 'AIzaSyC4IyTr17PyenYfQSiFD3mI3xCGIV0LsOk',
    // old: AIzaSyBLxGXn-ZzMfSKIobD-6C4chf4qI8XXRn8

    // display events
    events: 
      function(info, successCallback, failureCallback) {

      // Get a reference to the data 'title'
      const users = ref(db, 'users') 

      // Update user's calendar
      onValue(users, (snapshot => {
        const data = snapshot.val(); // get the new value

        // empty all past data fetched
        all_events = []

        let all_users = data
        let user = data[current_user]

        let upcoming_events = user.user_events

        for (let event in upcoming_events) {
          let new_event_obj = upcoming_events[event]

          // set event color by category
          let new_event_category = new_event_obj.category

          if (new_event_category != "") {

            try {
              let find_object = colors.find(o => o.name === new_event_category); // find object with the name == new_event_category
              let new_event_color = find_object.hex
  
              // add color to event object
              new_event_obj["color"] = new_event_color
            }

            catch(error) {
              console.log(error)
            }
            
          }
          
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
        var delete_success_modal = document.getElementById("deleteSuccessModal");

        // get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[1];

        // when the user clicks on the button, open the modal
        modal.style.display = "block";
        delete_success_modal.style.display = "none";

        // when the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = "none";
        }

        // --- DISPLAY EVENT DETAILS ---
        let event_id = event_info.publicId
        let event_category = info.event._def.extendedProps.category

        // if event_category is selected, set icon based on category
        if (event_category != "") {

          // if category is valid, set color based on category
          try {
            let obj = colors.find(o => o.name === event_category); // find object with the name == new_event_category
          
            let event_colour = obj.hex
            let dot = document.getElementById("eventColor")
            dot.style.background = event_colour

            // set icon based on category
            let event_icon = event_media[event_category][1]
            let icon = document.getElementById("eventIcon")
            icon.innerHTML = `<img src="img/${event_icon}" style='height: 50px;'>`
          }

          catch (error) {
            console.log(error)
          }
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

          // Fetch event
          let event_to_delete = calendar.getEventById(Number(event_id))

          // Delete event'
          const tasksRef = ref(db, 'users/' + current_user + 'user_events/event_' + event_id);

          remove(tasksRef).then(() => {
            // display deleted successfully
            delete_success_modal.style.display = "block";

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