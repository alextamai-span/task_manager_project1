// global vars
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDescription = document.getElementById('description-input');
const taskCategory = document.getElementById('task-categories');
const taskDate = document.getElementById('task-deadline');
const taskList = document.getElementById('task-list');
const clearBtn = document.getElementById('clear');

// function to display the tasks
function displayTasks() {
    taskList.innerHTML = '';
    const tasksInStorage = getTasksFromLocal();
    
    tasksInStorage.forEach(task => {
        const li = document.createElement('li');
        if (task.isCompleted) {
            li.classList.add('completed-task');
        }
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="task-info">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p><strong>Category:</strong> ${task.category}</p>
                <p><strong>Deadline:</strong> ${task.deadline}</p>
                <p><strong>Status:</strong> ${task.isCompleted ? 'Completed' : 'Pending'}</p>
            </div>
            <div class="task-actions">
                <button class="complete-btn"><i class="fa-solid fa-check"></i></button>
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
            `;
        taskList.appendChild(li);
    });
}

// function to add tasks to the list
taskForm.onsubmit = function(e) {
    e.preventDefault();

    const newTask = taskInput.value;
    const newCategory = taskCategory.value;
    let newDate = taskDate.value;

    // validating task
    if (newTask === '') {
        alert('Please add an task!');
        return;
    }
    
    // validating category
    if (newCategory === 'Select') {
        alert('Please select a category!')
        return;
    }

    // validating date
    let d = new Date();
    const curr =
        d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');

    if (curr > newDate) {
        alert('Please select a date in the future!')
        return;
    }

    // successful task
    const new_task = {
        id: Math.floor(Math.random() * 10000000000),
        title: newTask,
        description: taskDescription.value,
        category: newCategory,
        deadline: newDate,
        isCompleted: false
    };

    // add local storage
    addTaskToLocal(new_task);

    // display the tasks
    displayTasks();

    // display quote after every add new task
    getQuote();

    // clear
    taskInput.value = '';
    taskDescription.value = '';
}

// function to add task to local storage
function addTaskToLocal(task) {
    const tasksInStorage = getTasksFromLocal();

    tasksInStorage.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasksInStorage));
}

// get tasks from local storage
function getTasksFromLocal() {
    let tasksInStorage;

    if(localStorage.getItem('tasks') === null) {
        tasksInStorage = [];
    }
    else {
        tasksInStorage = JSON.parse(localStorage.getItem('tasks'));
    }
    
    return tasksInStorage;
}

// function to determine what happens when a task is clicked
taskList.onclick = function(e) {    
    const li = e.target.closest('li');
    if (!li) {
        return;
    }

    // get unique id
    const id = Number(li.dataset.id);
    // find task using the id
    const tasksInStorage = getTasksFromLocal();
    const task = tasksInStorage.find(t => t.id === id);
    if (!task) {
        return;
    }

    if (e.target.closest('.complete-btn')) {
        completeTask(task);
    }
    else if (e.target.closest('.edit-btn')) {
        editTask(task);
    } 
    else if (e.target.closest('.delete-btn')) {
        removeTask(task);
    }
}

// function for task completed
function completeTask(obj) {
    const tasks = getTasksFromLocal();
    const task = tasks.find(t => t.id === obj.id);
    if (!task) return;

    task.isCompleted = !task.isCompleted;

    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks(); 
}

// function for editting task
function editTask(task) {
    taskInput.value = task.title;
    taskDescription.value = task.description;
    taskCategory.value = task.category;
    taskDate.value = task.deadline;

    // Remove old task so editing replaces it
    const tasksInStorage = getTasksFromLocal();
    tasks = tasksInStorage.filter(t => t.id !== task.id);
    
    if(confirm('Are you sure you want to edit this task?')) {
        const newTask = tasksInStorage.filter(t => t.id !== task.id);

        localStorage.setItem('tasks', JSON.stringify(newTask));
        displayTasks();
    }
}

// function to remove a task
function removeTask(task) {
    const tasksInStorage = getTasksFromLocal();
    if(confirm('Are you sure you want to remove this task?')) {
        const tasks = tasksInStorage.filter(t => t.id !== task.id);

        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    }
}


clearBtn.onclick = function() {
    if (confirm('Are you sure you want to delete all tasks?')) {
        while(taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
    }
    localStorage.removeItem('tasks');
};

// function to display quote after every new task
//  function getQuote() {
//   let res = fetch("https://zenquotes.io/api/random");
//   let data = res.json();
//   alert(data.content);
// }

// function getQuote() {
//   fetch("https://zenquotes.io/api/random/zen")
//     .then(res => res.json())
//     .then(data => alert(data.content));
// }

window.onload = () => displayTasks();