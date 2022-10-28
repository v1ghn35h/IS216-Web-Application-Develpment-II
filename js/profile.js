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

    console.log("i'm in");
}
$("#imageUpload").change(function() {
    readURL(this);
});

function foo(){
    console.log("hello");
}


//////////////////////////////////////////////////
// EDIT BUTTON
var incompleteTasksHolder = document.getElementById("details"); //incomplete-tasks

//Edit an existing task
var editTask = function() {
	console.log("Edit task...");

	var listItem = this.parentNode;

	var editInput = listItem.querySelector("input[type=text]");
	var label = listItem.querySelector("label");

	var containsClass = listItem.classList.contains("editMode");

	//if the class of the parent is .editMode
	if (containsClass) {
		//Switch from .editMode
		//label text become the input's value
		label.innerText = editInput.value;
	} else {
		//Switch to .editMode
		//input value becomes the label's text
		editInput.value = label.innerText;
	}

	//Toggle .editMode on the list item
	listItem.classList.toggle("editMode");

}


//Mark a task as complete
var taskCompleted = function() {
	console.log("Task complete...");
	//Append the task list item to the #completed-tasks
	var listItem = this.parentNode;
	completedTasksHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskIncomplete);
}

var bindTaskEvents = function(taskListItem) {
	console.log("Bind list item events");
	//select taskListItem's children
	var editButton = taskListItem.querySelector("button.edit");

	//bind editTask to edit button
	editButton.onclick = editTask;
}

//cycle over incompleteTasksHolder ul list items
for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
	//bind events to list item's children (taskCompleted)
	bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

