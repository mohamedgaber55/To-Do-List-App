// catch all elements
let theInput = document.querySelector(".add-task input");
let theAddButton = document.querySelector(".add-task .plus");
let tasksContainer = document.querySelector(".task-content");
let tasksCount = document.querySelector(".tasks-count span");
let tasksCompleted = document.querySelector(".tasks-completed span");
let deleteAll = document.querySelector(".control .delete-all");
let finishAll = document.querySelector(".control .finish");

// empty array to store tasks
let ArryOfTasks = [];

// check if there are tasks in localStorage
if (localStorage.getItem("tasks")) {
    ArryOfTasks = JSON.parse(localStorage.getItem("tasks"));
}
// trigger the function to get the data from localStorage
    getDataFromLocalStorage();

// focus on input when the page load
window.onload = function () {
    theInput.focus();
    if (tasksContainer.innerHTML == '') {
        showNoTasks();
    }
    if(ArryOfTasks.length == 0 && deleteAll.style.display == 'block'){
        deleteAll.style.display = 'none';
    }
};

// add click and check if input is empty or no and create the task.
theAddButton.onclick = function () {

    // the sweet alert if the input is empty.
    if (theInput.value == '') {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Cannot Add An Empty Task!",
        });
    }
    else {

    // the sweet alert no duplicate of task
    let existingTasks = document.querySelectorAll(".task-content .task");
    for (let task of existingTasks) {
        if (task.firstChild.nodeValue === theInput.value) {
            Swal.fire({
                icon: "warning",
                title: "Duplicate Task",
                text: "This task already exists!",
            });
            return;
        }
    }
    addTaskToArray(theInput.value);

    // select no task Element
    let noTasks = document.querySelector(".no-tasks-to-show");

    if(document.body.contains(noTasks)){
    // remove no tasks message
        noTasks.remove();
    }

    // show deleteAll button
    deleteAll.style.display = 'block';

    // empty the input
    theInput.value = '';

    // focus on input
    theInput.focus();

    calculateTasks();
}
};

// function that add tasks to array to convert it to string and after that add it in localStorage
function addTaskToArray(taskText){
    const task = {
        id : Date.now(),
        completed : false,
        taskContent : taskText,
    }

    // push task to ArryOfTasks
    ArryOfTasks.push(task);
    
    // add tasks to page
    addTasksToPageFrom(ArryOfTasks);

    // add tasks to localStorage
    setTasksOnlocalStorageFrom(ArryOfTasks)

    calculateTasks();

}

// function that create task Element and append it to tasksContainer depend on array of tasks
function addTasksToPageFrom(ArryOfTasks){

    tasksContainer.innerHTML = '';

    ArryOfTasks.forEach((theTask) => {
        
        //[dom] create the task and content
        let task = document.createElement('span');
        let messageCont = document.createTextNode(theTask.taskContent);
        
        // create delete button
        let deleteCont = document.createElement('span');
        let deleteMsg = document.createTextNode('delete');
        
        // add class to task and delete
        deleteCont.setAttribute('class', 'delete');
        task.className = 'task';
        task.setAttribute('id', theTask.id);
        
        if (theTask.completed){
            task.className = 'task finished';
        }
    // append the task to task-container
    task.appendChild(messageCont);
    task.appendChild(deleteCont);
    deleteCont.appendChild(deleteMsg);
    tasksContainer.appendChild(task);
    // end [dom]

    // no duplicate to task
});
}

// function that add tasks to localStorage
function setTasksOnlocalStorageFrom(ArryOfTasks){
    window.localStorage.setItem("tasks", JSON.stringify(ArryOfTasks))
}

// function that get tasks from localStorage and set it on page 
function getDataFromLocalStorage() {
    let data = window.localStorage.getItem("tasks");
        if (data) {
            let tasks = JSON.parse(data);
            addTasksToPageFrom(tasks);
            // show deleteAll button
            deleteAll.style.display = 'block';
        }
}

// remove the task when click on the delete button or add finished on it.
document.addEventListener('click', function(e){

    // delete task from page 
    if(e.target.className == 'delete'){
        e.target.parentNode.remove();

        // delete task from localStorage
        deleteTaskWith(e.target.parentElement.getAttribute("id"))

        // to remove the deleted from the all counted
        calculateTasks();

        // show no tasks when there is no tasks
        if(tasksContainer.childElementCount == 0){
            showNoTasks();
        }
    }

    // finished
    if(e.target.classList.contains('task')){
        e.target.classList.toggle("finished");

        toggleTaskWith(e.target.getAttribute("id"))
        // to remove the finshed from the all counted
        calculateTasks();
    }

});

// function that handle click on delete button to delete the task 
function deleteTaskWith(id){
    ArryOfTasks = ArryOfTasks.filter(task => task.id != id);
    setTasksOnlocalStorageFrom(ArryOfTasks);
    calculateTasks();
    // show no tasks when there is no tasks
    if(tasksContainer.childElementCount == 0){
        showNoTasks();
    }
    // show deleteAll button
    if(ArryOfTasks.length == 0){
        deleteAll.style.display = 'none';
    }
}

// function that handle click on task to complete the task 
function toggleTaskWith(taskid){
    for(let i = 0; i < ArryOfTasks.length; i++){
        if(ArryOfTasks[i].id == taskid){
            ArryOfTasks[i].completed == false ? (ArryOfTasks[i].completed = true) : (ArryOfTasks[i].completed = false) 
        }
    }
    setTasksOnlocalStorageFrom(ArryOfTasks);
}

//handle the event of delete all button.
deleteAll.addEventListener('click', deleteAllTasks);

function deleteAllTasks(){
    tasksContainer.textContent='';
    deleteAllTasksInLocalStorage();
    showNoTasks();
    calculateTasks();
    deleteAll.style.display = "none";
}

// delete all tasks from localStorage
function deleteAllTasksInLocalStorage(){
    window.localStorage.removeItem("tasks");
    ArryOfTasks = [];
    calculateTasks();
}

// function to create the message of show no tasks
function showNoTasks(){
    let notask = document.createElement("span");
    let noText = document.createTextNode("No Tasks To Show");

    notask.appendChild(noText);
    notask.className = 'no-tasks-to-show';
    tasksContainer.appendChild(notask);
}

// // function to calculate the all of deleted and finished

function calculateTasks(){
    let conuntOfTasks = document.querySelectorAll('.task-content .task').length;
    let completedTasks = document.querySelectorAll('.task-content .finished').length;

    localStorage.setItem("count", conuntOfTasks);
    localStorage.setItem("completed", completedTasks);

    tasksCount.innerHTML = localStorage.getItem("count");
    tasksCompleted.innerHTML = localStorage.getItem("completed");
}

calculateTasks();