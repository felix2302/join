
let checkedContacts = [];
let trueContacts = [];
let contactsTaskOpen = false;
let activeUrg = [
    {
        "urgency": "high",
        "active": false
    },
    {
        "urgency": "mid",
        "active": false
    },
    {
        "urgency": "low",
        "active": false
    }
];

let taskData = {
    "title": "",
    "description": "",
    "assigned_to": [],
    "due_date": "",
    "priority": "",
    "category": "",
    "subtasks": [],
    "status": "todo",
    "id": "",
};

let availableCategorys = [
    "Technical Task",
    "User Story"
];

let contacts = {};

async function initAddTask() {
    await includeHTML();
    changeUrgency("mid");
    contacts = await loadData(CONTACTS_URL);
    let status = localStorage.getItem("status");
    setStatus(status);
    setBackground(1);
};

function handleClickEvent(event) {
    closeContacts(event);
    closeCategorys(event);
    closeSubtasks(event);
    formValidationFeedbackOff();
};

/**
 * Changes the urgency level.
 * @param {string} urg - The urgency level to set.
 */
function changeUrgency(urg) {
    if (urg === "high") {
        activeUrg[0].active = true;
        activeUrg[1].active = false;
        activeUrg[2].active = false;
    } else if (urg === "mid") {
        activeUrg[0].active = false;
        activeUrg[1].active = true;
        activeUrg[2].active = false;
    } else if (urg === "low") {
        activeUrg[0].active = false;
        activeUrg[1].active = false;
        activeUrg[2].active = true;
    }
    changeBgBtn();
};

function clearTaskDataArray() {
    taskData = {
        "title": "",
        "description": "",
        "assigned_to": [],
        "due_date": "",
        "priority": "",
        "category": "",
        "subtasks": [],
        "status": "todo"
    };
};

function renderTaskList() {
    let content = document.getElementById("dropdownCategorys");
    content.innerHTML = "";
    for (let i = 0; i < availableCategorys.length; i++) {
        const category = availableCategorys[i];
        content.innerHTML += returnTaskListHTML(category, i);
    }
};

/**
 * Opens the contacts list.
 * @returns {Promise<void>}
 */
async function openContacts() {
    if (contactsTaskOpen === false) {
        displayContacts("open");
        renderContactList();
        for (let i = 0; i < contacts.length; i++) {
            if (contacts.length > checkedContacts.length) {
                checkedContacts.push(false);
            }
        }
        contactsTaskOpen = true;
    }
};

/**
 * Closes the contacts list.
 * @param {Event} event
 */
function closeContacts(event) {
    if (contactsTaskOpen === true && event) {
        event.stopPropagation();
        displayContacts("close");
        contactsTaskOpen = false;
    }
};

/**
 * Renders the contact list.
 * @returns {Promise<void>}
 */
async function renderContactList() {
    let content = document.getElementById("dropdownMenu");
    content.innerHTML = "";
    content.innerHTML = ``;
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        content.innerHTML += returnContactList(contact, i);
        checkAssignments(i);
    }
};

/**
 * Checks the assignments.
 * @param {number} i
 */
function checkAssignments(i) {
    if (checkedContacts[i] === true) {
        displayAssignments("checked", i);
    } else if (checkedContacts[i] === false) {
        displayAssignments("unchecked", i);
    }
};

/**
 * Assigns a contact.
 * @param {number} i
 * @returns {Promise<void>}
 */
async function assignContact(i) {
    trueContacts = checkedContacts.filter(checkedContact => checkedContact === true);
    if (checkedContacts[i] === false) {
        checkedContacts[i] = true;
    } else if (checkedContacts[i] === true) {
        checkedContacts[i] = false;
    }
    renderSignList();
    checkAssignments(i);
};

/**
 * Renders the sign list.
 * @returns {Promise<void>}
 */
async function renderSignList() {
    let content = document.getElementById("signContainer");
    content.innerHTML = "";
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        if (checkedContacts[i] === true) {
            content.innerHTML += returnSignList(contact, i);
        }
    }
    controlCheckedLength();
};

function controlCheckedLength() {
    let container = document.getElementById("signContainer");
    let trueCount = checkedContacts.filter(value => value === true).length;
    if (trueCount >= 1) {
        container.style.display = "";
    } else if (trueCount < 1) {
        container.style.display = "none";
    }
};

function addSubtask() {
    let input = document.getElementById("subtasksInput");
    if (input.value !== "") {
        let subtaskArray = { text: `${input.value}`, status: "unchecked" };
        taskData.subtasks.push(subtaskArray);
        renderSubtasks();
    }
    clearInputfield();
};

function renderSubtasks() {
    container = document.getElementById("addedSubtasks");
    container.innerHTML = "";
    for (let i = 0; i < taskData.subtasks.length; i++) {
        const subtask = taskData.subtasks[i];
        container.innerHTML += returnSubtasksList(subtask, i);
    }
};

/**
 * Checks the edit key.
 * @param {KeyboardEvent} ev
 * @param {number} i
 */
function checkEditKey(ev, i) {
    if (ev.key === "Enter") {
        ev.preventDefault();
        saveSubtask(i);
    }
};

/**
 * Deletes a subtask.
 * @param {number} i
 */
function deleteSubtask(i) {
    taskData.subtasks.splice(i, 1);
    renderSubtasks();
};

/**
 * Saves a subtask.
 * @param {number} i
 */
function saveSubtask(i) {
    let subtask = document.getElementById("editedValue").value;
    let subtaskArray = { text: subtask, status: "unchecked" };
    taskData.subtasks[i] = subtaskArray;
    renderSubtasks();
};

/**
 * Checks the key for adding a subtask.
 * @param {KeyboardEvent} ev
 */
function checkKey(ev) {
    if (ev.key === 'Enter') {
        ev.preventDefault();
        addSubtask();
    }
};

function clearInputfield() {
    document.getElementById("subtasksInput").value = "";
    hideWarning();
};

function clearAllInputs() {
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDate").value = "";
    document.getElementById("categoryInput").value = "Select task category";
};

/**
 * Gets assigned contacts and updates task data.
 * @param {Array} contacts
 * @returns {Promise<void>}
 */
async function getAssignedContacts(contacts) {
    if (checkedContacts.length > 0) {
        for (let i = 0; i < checkedContacts.length; i++) {
            const assignedContact = checkedContacts[i];
            if (assignedContact == true) {
                taskData.assigned_to.push(contacts[i]);
            }
        }
    } else {
        taskData.assigned_to = "";
    }
};

async function addNewTask() {
    document.getElementById("createButton").onclick = "";
    document.getElementById("createButton").disabled = true;
    saveInputValues();

};

async function saveInputValues() {
    let title = document.getElementById("taskTitle").value;
    let description = document.getElementById("taskDescription").value;
    let due_date = document.getElementById("taskDate").value;
    let category = document.getElementById("categoryInput").value;
    if (title.length >= 1 && due_date.length >= 1 && category.length >= 1) {
        formValidationFeedbackOff();
        await postNewTask(title, due_date, description, category);
    }
};

function handleFormValidation() {
    let title = document.getElementById("taskTitle").value;
    let due_date = document.getElementById("taskDate").value;
    let category = document.getElementById("categoryInput").value;
    if (title.length >= 1 || due_date.length >= 1 || category.length >= 1) {
        formValidationFeedbackOff();
    } else {
        formValidationFeedbackOn();
    }
};

/**
 * Posts the new task.
 * @param {string} title
 * @param {string} due_date
 * @param {string} description
 * @param {string} category
 * @returns {Promise<void>}
 */
async function postNewTask(title, due_date, description, category) {
    await postingTask(title, due_date, description, category);
    succesfullAdded();
    setTimeout(() => {
        getLocationAndMove();
    }, 1500);
};

/**
 * Handles posting the task data.
 * @param {string} title
 * @param {string} due_date
 * @param {string} description
 * @param {string} category
 * @returns {Promise<void>}
 */
async function postingTask(title, due_date, description, category) {
    await setTaskData(title, due_date, description, category);
    await postData(TASKS_URL, taskData);
    clearAll();
};

/**
 * Sets the task data.
 * @param {string} title
 * @param {string} due_date
 * @param {string} description
 * @param {string} category
 * @returns {Promise<void>}
 */
async function setTaskData(title, due_date, description, category) {
    if (taskData.subtasks.length === 0) {
        taskData.subtasks = "";
    }
    getAssignedContacts(contacts);
    getUrgency();
    taskData.title = title;
    taskData.description = description;
    taskData.due_date = due_date;
    taskData.category = category;
    taskData.id = "";
};

function getLocationAndMove() {
    let location = window.location;
    if (location.pathname == "/html/board.html") {
        closeNewTaskInBoard();
        succesfullAddedClose();
        getTasks();
    } else if (location.pathname == "/html/addtask.html") {
        window.location = "../html/board.html";
    }
};
