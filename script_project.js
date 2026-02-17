// global variables
// ----------------
// document: searches the HTML document
// getElementById: returns the element with the specified id
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDescription = document.getElementById('description-input');
const taskCategory = document.getElementById('task-categories');
const taskDate = document.getElementById('task-deadline');
const taskList = document.getElementById('task-list'); // taskList is a table
const clearBtn = document.getElementById('clear');

// function to display the tasks
// -----------------------------
const displayTasks = () => {
    // clear the list before displaying tasks
    taskList.innerHTML = '';

    // get tasks from local storage
    // returns an array of tasks stored in local storage
    const tasksInStorage = getTasksFromLocal();
    
    // loop through tasks array and displays them
    tasksInStorage.forEach(
        // task: the current element being processed in the array
        // is an object
        task => {
            // createElement: creates an HTML element specified by the tag name
            // li: list item, display each task in the list
            const li = document.createElement('li');

            // if the task is completed, add the class 'completed-task' to the list item
            if (task.isCompleted) {
                li.classList.add('completed-task');
            }

            // dataset: allows you to store custom data attributes on HTML elements
            // id: the unique identifier for the task, used to identify the task when editing or deleting
            // this becomes: <li data-id="123">
            li.dataset.id = task.id;

            // innerHTML: sets the HTML content of the list item, displays the task information and action buttons
            li.innerHTML = `
                <div class="task-info" id="task-info-${task.id}">
                    <!-- h3: defines a heading for the task -->
                    <h3>${task.title}</h3>

                    <!-- p: defines a paragraph for the task description -->
                    <p>${task.description}</p>

                    <!-- p: defines a paragraph for the task category -->
                    <!-- strong: important text, make the label bold -->
                    <p><strong>Category:</strong> ${task.category}</p>

                    <!-- p: defines a paragraph for the task deadline -->
                    <p><strong>Deadline:</strong> ${task.deadline}</p>

                    <!-- p: defines a paragraph for the task status -->
                    <!--
                      ?: ternary operator,
                        'Completed': if task.isCompleted is true, display 'Completed'
                        'Pending': if task.isCompleted is false, display 'Pending'
                    -->
                    <p><strong>Status:</strong> ${task.isCompleted ? 'Completed' : 'Pending'}</p>
                </div>

                <div class="task-actions">
                    <!-- button: create a clickable button for marking task as complete -->
                    <!--
                        class: CSS styling
                        i: used to include icons
                          class: the specific icon to display
                            check: a check mark icon, indicates task completion
                            pen: a pen icon, indicates editing the task
                            trash: a trash can icon, indicates deleting the task
                    -->
                    <button class="complete-btn" id="complete-btn-${task.id}"><i class="fa-solid fa-check"></i></button>
                    <button class="edit-btn" id="edit-btn-${task.id}"><i class="fa-solid fa-pen"></i></button>
                    <button class="delete-btn" id="delete-btn-${task.id}"><i class="fa-solid fa-trash"></i></button>
                </div>  
            `;
            
            // appendChild: adds the list item to the task list, displays the task on the webpage
            taskList.appendChild(li);
        }
    );
}

// function to add tasks to the list
// ---------------------------------
// addEventListener: attaches an event handler to the task form,
//   listens for the 'submit' event, 
//   executes the provided function when the event occurs
taskForm.addEventListener('submit', (e) => {
    // Prevents page from reloading when form is submitted
    e.preventDefault();

    // Get values from the form inputs
    const newTask = taskInput.value;
    const newCategory = taskCategory.value;
    let newDate = taskDate.value;

    // validating task title
    if (newTask === '') {
        alert('Please add a task!');
        // Stop executing
        return;
    }
    
    // validating category selection
    if (newCategory === 'Select') {
        alert('Please select a category!');
        // Stop executing
        return;
    }

    // validating date
    // get current date in the format of YYYY-MM-DD
    let d = new Date();
    // fortmat the date to match the input date format
    const curr =
        d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
    // compare the current date with the selected date
    if (curr > newDate) {
        // selected date is in the past
        alert('Please select a date in the future');
        // Stop executing
        return;
    }

    // successful new task object
    const new_task = {
        // adds a random unquie id
        // should be auto-generated in a real application, but for simplicity we use random number here
        id: Math.floor(Math.random() * 10000000000),
        title: newTask,
        description: taskDescription.value,
        category: newCategory,
        deadline: newDate,
        isCompleted: false
    };

    // add new task to local storage
    addTaskToLocal(new_task);

    // display the tasks
    displayTasks();

    // clear inputs after successful new task
    taskInput.value = '';
    taskDescription.value = '';
});

// function to add task to local storage
// -------------------------------------
const addTaskToLocal = (task) => {
    // Get the existing array of tasks from localStorage
    // This returns an ARRAY
    const tasksInStorage = getTasksFromLocal();

    // Add the new task OBJECT to the array
    tasksInStorage.push(task);

    // Convert the updated array into a JSON string
    // and store it in localStorage under the key "tasks"
    localStorage.setItem('tasks', JSON.stringify(tasksInStorage));
}

// get tasks from local storage
// ----------------------------
// returns an array of the tasks
const getTasksFromLocal = () => {
    // temp variable to hold the tasks array from local storage
    let tasksInStorage;

    // Check if there are any tasks in local storage
    if(localStorage.getItem('tasks') === null) {
        // no tasks in local storage, initialize an empty array
        tasksInStorage = [];
    }
    else {
        // tasks are in local storage, parse the JSON string back into an array of task objects
        tasksInStorage = JSON.parse(localStorage.getItem('tasks'));
    }
    
    // return the array of tasks
    return tasksInStorage;
}

// function to determine what happens when a task is clicked
// ---------------------------------------------------------
taskList.addEventListener('click', (e) => {
    // find the closest element that was clicked that has an id
    // closest- risky, dont want to use, use the id
    const buttonClicked = e.target.closest('[id]');

    if (!buttonClicked) {
        // if no button was clicked, return early
        return;
    }

    // find the closest parent list item (li) of the clicked element
    // li: the task list item was clicked
    const li = buttonClicked.closest('li');

    if (!li) {
        // if no list item was found, return early
        return;
    }

    // get unique id
    const id = Number(li.dataset.id);

    // get the tasks from local storage as an array of task objects
    const tasksInStorage = getTasksFromLocal();
    // search the array of tasks for the task object with the matching id
    const task = tasksInStorage.find(t => t.id === id);

    if (!task) {
        // if no task is found with the matching id, return early
        return;
    }

    // determine which button was clicked 
    if (e.target.closest('.complete-btn')) {
        completeTask(task);
    }
    else if (e.target.closest('.edit-btn')) {
        editTask(task);
    } 
    else if (e.target.closest('.delete-btn')) {
        removeTask(task);
    }
});

// function for task completed
// ---------------------------
const completeTask = (taskObj) => {
    // get the tasks from local storage as an array of task objects
    const tasksInStorage = getTasksFromLocal();

    // search the array of tasks for the task object with the matching id
    // find returns ??????????????????????????????
    const task = tasksInStorage.find(t => t.id === taskObj.id);

    if (!task) { 
        // if no task is found with the matching id, return early
        return;
    }

    // toggle the isCompleted property of the task object
    // if false, becomes true
    // if true, becomes false
    task.isCompleted = !task.isCompleted;

    // update the tasks in local storage with the modified task object
    localStorage.setItem('tasks', JSON.stringify(tasksInStorage));

    // update the display of tasks to reflect the change
    displayTasks(); 
};

// function for editting task
// --------------------------
const editTask = (task) => {
    // ensure the user wants to edit the task
    if(!confirm('Are you sure you want to edit this task?')) {
        // if user clicks "Cancel", return early and do not proceed with editing
        return;
    }    

    // pre-fill the form inputs 
    taskInput.value = task.title;
    taskDescription.value = task.description;
    taskCategory.value = task.category;
    taskDate.value = task.deadline;

    // get the tasks from local storage as an array of task objects
    const tasksInStorage = getTasksFromLocal();

    // remove old task so editing replaces it
    // filter returns a new array of the tasks
    tasks = tasksInStorage.filter(t => t.id !== task.id);
    
    // create a new array of tasks that excludes the task being edited
    // will be removing the old task from local storage
    const newTask = tasksInStorage.filter(t => t.id !== task.id);

    // update the tasks in local storage with the modified task object
    localStorage.setItem('tasks', JSON.stringify(newTask));

    // update the display of tasks to reflect the change
    displayTasks();
};

// function to remove a task
// -------------------------
const removeTask = (task) => {
    // ensure the user wants to remove the task
    if(!confirm('Are you sure you want to remove this task?')) {
        // if user clicks "Cancel", return early and do not proceed with removing
        return;
    }    

    // get the tasks from local storage as an array of task objects
    const tasksInStorage = getTasksFromLocal();

    // create a new array of tasks that excludes the task being removed
    const tasks = tasksInStorage.filter(t => t.id !== task.id);

    // update the tasks in local storage with the modified array of tasks
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // update the display of tasks to reflect the change
    displayTasks();
    
};

// function to clear all tasks
// ---------------------------
clearBtn.addEventListener('click', () => {
    // ensure the user wants to clear all tasks
    if (!confirm('Are you sure you want to delete all tasks?')) {
        // if user clicks "Cancel", return early and do not proceed with clearing all tasks
        return;
    }

    // clear all tasks from local storage by removing the "tasks" item
    localStorage.removeItem('tasks');

    // update the display of tasks to reflect the change
    displayTasks();
});

// auto-display tasks when the page loads
// --------------------------------------
// DOMContentLoaded: runs after HTML document has been parsed and DOM is fully created
window.addEventListener('DOMContentLoaded', () => {
    // when page opens or reloads, go to display tasks function
    displayTasks();
});