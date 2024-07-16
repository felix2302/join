
let controlContacts = [];
let taskDataEdit = {};
let contactsEdit = {};
let taskId = "";
let availableStatus = [
    "To do",
    "In progress",
    "Await feedback",
    "Done"
];
let newStatus = "";
let taskStatusEdit = "";

/**
 * Updates the edited task data.
 * @returns {Promise<void>}
 */
async function putEditTask() {
    await setInputValuesEdit();
    if (taskDataEdit.title.length >= 1 && taskDataEdit.due_date.length >= 1) {
        if (taskDataEdit.assigned_to.length == 0) {
            taskDataEdit.assigned_to = "";
        }
        await putDataObject(TASKS_URL, taskDataEdit, taskId);
    }
    controlContacts = [];
    initBoard();
    taskContainer.innerHTML = renderTask(taskDataEdit.id);
};

/**
 * Initializes data for editing a task.
 * @param {Object} task - The task object.
 * @param {string} id - The task ID.
 * @returns {Promise<void>}
 */
async function initDataEditTask(task, id) {
    taskDataEdit = task;
    taskStatusEdit = task.status;
    taskId = id;
    contactsEdit = await loadData(CONTACTS_URL);
    let assignedContacts = task.assigned_to;
    changeUrgencyEdit(task.priority);
    settingControlContacts(assignedContacts);
    renderSignListEdit();
    renderSubtasksEdit();
};

/**
 * Sets input values for editing a task.
 * @returns {Promise<void>}
 */
async function setInputValuesEdit() {
    await getAssignedContactsEdit();
    getUrgencyEdit();
    taskDataEdit.title = document.getElementById("taskTitleEdit").value;
    taskDataEdit.description = document.getElementById("taskDescriptionEdit").value;
    taskDataEdit.due_date = document.getElementById("taskDateEdit").value;
    if (newStatus !== "") {
        taskDataEdit.status = newStatus;
    } else {
        taskDataEdit.status = taskStatusEdit;
    }
};

/**
 * Gets assigned contacts for editing a task.
 * @returns {Promise<void>}
 */
async function getAssignedContactsEdit() {
    taskDataEdit.assigned_to = [];
    if (contactsEdit.length > 0) {
        for (let i = 0; i < controlContacts.length; i++) {
            const assignedContact = controlContacts[i];
            if (assignedContact === true) {
                taskDataEdit.assigned_to.push(contactsEdit[i]);
            }
        }
    }
};

/**
 * Gets the urgency level for editing a task.
 */
function getUrgencyEdit() {
    for (let i = 0; i < activeUrgEdit.length; i++) {
        const urg = activeUrgEdit[i];
        if (urg.active === true) {
            taskDataEdit.priority = urg.urgency;
        }
    }
};

function handleClickEventEdit(event) {
    closeContactsEdit(event);
    closeSubtasksEdit(event);
    closeStatusEdit(event);
};

/**
 * Checks if the Enter key is pressed and adds a subtask for editing.
 * @param {KeyboardEvent} ev
 */
function checkKeyEdit(ev) {
    if (ev.key === 'Enter') {
        ev.preventDefault();
        addSubtaskEdit();
    }
};

/**
 * Sets control contacts for editing based on the current and assigned contacts.
 * @param {Array} assignedContacts - Array of assigned contacts.
 */
function settingControlContacts(assignedContacts) {
    if (assignedContacts === undefined) {
        assignedContacts = [];
    }
    if (assignedContacts.length > 0) {
        for (let i = 0; i < contactsEdit.length; i++) {
            const contact = contactsEdit[i];
            let isAssigned = false;
            for (let j = 0; j < assignedContacts.length; j++) {
                const assignedContact = assignedContacts[j];
                if (contact.id === assignedContact.id) {
                    isAssigned = true;
                }
            }
            controlContacts.push(isAssigned);
        }
    } else if (assignedContacts.length === 0) {
        for (let i = 0; i < contactsEdit.length; i++) {
            controlContacts.push(false);
        }
    }
};

function openCalenderEdit() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("taskDateEdit").setAttribute('min', today);
    document.getElementById("taskDateEdit").showPicker();
    document.getElementById("taskDateEdit").style.color = "black";
};

/**
 * Opens the contacts dropdown for editing.
 * @returns {Promise<void>}
 */
async function openContactsEdit() {
    if (contactsTaskOpen === false) {
        displayContactsEdit("open");
        renderContactListEdit();
        contactsTaskOpen = true;
    }
};

/**
 * Closes the contacts dropdown for editing.
 * @param {Event} event
 */
function closeContactsEdit(event) {
    if (contactsTaskOpen === true && event) {
        event.stopPropagation();
        displayContactsEdit("close");
        contactsTaskOpen = false;
    }
};

/**
 * Renders the contact list for editing.
 * @returns {Promise<void>}
 */
async function renderContactListEdit() {
    let content = document.getElementById("dropdownMenuEdit");
    content.innerHTML = "";
    content.innerHTML = ``;
    for (let i = 0; i < contactsEdit.length; i++) {
        const contact = contactsEdit[i];
        content.innerHTML += returnContactListEdit(contact, i);
        checkAssignmentsEdit(i);
    }
};

/**
 * Checks assignments for editing.
 * @param {number} i - The index of the contact.
 */
function checkAssignmentsEdit(i) {
    if (controlContacts[i] === true) {
        displayAssignmentsEdit("checked", i);
    } else if (controlContacts[i] === false) {
        displayAssignmentsEdit("unchecked", i);
    }
};

/**
 * Assigns a contact for editing.
 * @param {number} i - The index of the contact.
 * @returns {Promise<void>}
 */
async function assignContactEdit(i) {
    if (controlContacts[i] === false) {
        controlContacts[i] = true;
    } else if (controlContacts[i] === true) {
        controlContacts[i] = false;
    }
    renderSignListEdit();
    checkAssignmentsEdit(i);
};


/**
 * Renders the sign list for editing.
 * @returns {Promise<void>}
 */
async function renderSignListEdit() {
    if (controlContacts.includes(true)) {
        let content = document.getElementById("signContainerEdit");
        content.innerHTML = "";
        for (let i = 0; i < contactsEdit.length; i++) {
            const contact = contactsEdit[i];
            if (controlContacts[i] === true) {
                content.innerHTML += returnSignListEdit(contact, i);
            }
        }
    }
    controlCheckedLengthEdit();
};

/**
 * Controls the display of checked contacts for editing.
 */
function controlCheckedLengthEdit() {
    let container = document.getElementById("signContainerEdit");
    let trueCount = controlContacts.filter(value => value === true).length;
    if (trueCount >= 1) {
        container.style.display = "";
    } else if (trueCount < 1) {
        container.style.display = "none";
    }
};

/**
 * Changes the urgency level for editing a task.
 * @param {string} urg - The urgency level.
 */
function changeUrgencyEdit(urg) {
    if (urg === "high") {
        activeUrgEdit[0].active = true;
        activeUrgEdit[1].active = false;
        activeUrgEdit[2].active = false;
    } else if (urg === "mid") {
        activeUrgEdit[0].active = false;
        activeUrgEdit[1].active = true;
        activeUrgEdit[2].active = false;
    } else if (urg === "low") {
        activeUrgEdit[0].active = false;
        activeUrgEdit[1].active = false;
        activeUrgEdit[2].active = true;
    }
    changeBgBtnEdit();
};

/**
 * Renders the status list for editing by populating the dropdown with status options.
 */
function renderStatusListEdit() {
    let content = document.getElementById("dropdownCategorysEdit");
    content.innerHTML = "";
    for (let i = 0; i < availableStatus.length; i++) {
        const status = availableStatus[i];
        content.innerHTML += returnTaskListHTMLEdit(status, i);
    }
};

/**
 * Updates the status of the task being edited and sets the category input value.
 * @param {number} i - The index of the status in the availableStatus array.
 */
function addStatusEdit(i) {
    newStatus = (availableStatus[i] === "To do") ? "todo"
        : (availableStatus[i] === "In progress") ? "inprogress"
            : (availableStatus[i] === "Await feedback") ? "awaitfeedback"
                : (availableStatus[i] === "Done") ? "done"
                    : taskDataEdit.status;
    document.getElementById("categoryInputEdit").value = getActualStatus(newStatus);
};

/**
 * Gets the display string for a given task status.
 * @param {string} status - The status of the task.
 * @returns {string} The display string for the status.
 */
function getActualStatus(status) {
    correctStatus = (status === "todo") ? "To do"
        : (status === "inprogress") ? "In progress"
            : (status === "awaitfeedback") ? "Await feedback"
                : (status === "done") ? "Done"
                    : status;
    return correctStatus;
};

/**
 * Opens the subtasks input field for editing.
 */
function openSubtasksEdit() {
    let imgContainer = document.getElementById("subtaskImgContEdit");
    document.getElementById("subtasksInputEdit").focus();
    imgContainer.innerHTML = "";
    imgContainer.innerHTML = returnSubtaskImgEdit();
};

/**
 * Adds a subtask for editing.
 */
function addSubtaskEdit() {
    let input = document.getElementById("subtasksInputEdit").value;
    if (taskDataEdit.subtasks === "") {
        taskDataEdit.subtasks = [];
    }
    let subtaskArray = { text: `${input}`, status: "unchecked" }
    taskDataEdit.subtasks.push(subtaskArray);
    renderSubtasksEdit();
    clearInputfieldEdit();
};

/**
 * Renders the subtasks list for editing.
 */
function renderSubtasksEdit() {
    container = document.getElementById("addedSubtasksEdit");
    container.innerHTML = "";
    for (let i = 0; i < taskDataEdit.subtasks.length; i++) {
        const subtask = taskDataEdit.subtasks[i];
        container.innerHTML += returnSubtasksListEdit(subtask, i);
    }
};

/**
 * Edits a subtask in editing mode.
 * @param {number} i - The index of the subtask.
 */
function editSubtaskEdit(i) {
    document.getElementById(`subtaskEdit${i}`).innerHTML = returnEditSubtaskHTMLEdit(i);
    document.getElementById("editedValueEdit").focus();
    document.getElementById("editedValueEdit").select();
};

/**
 * Checks if the Enter key is pressed and saves the edited subtask.
 * @param {KeyboardEvent} ev
 * @param {number} i - The index of the subtask.
 */
function checkEditKeyEdit(ev, i) {
    if (ev.key === "Enter") {
        ev.preventDefault();
        saveSubtaskEdit(i);
    }
};

/**
 * Saves the edited subtask.
 * @param {number} i - The index of the subtask.
 */
function saveSubtaskEdit(i) {
    let subtask = document.getElementById("editedValueEdit").value;
    let subtaskArray = { text: subtask, status: "unchecked" };
    taskDataEdit.subtasks[i] = subtaskArray;
    renderSubtasksEdit();
};

/**
 * Clears the input field for subtasks in editing mode.
 */
function clearInputfieldEdit() {
    document.getElementById("subtasksInputEdit").value = "";
};

/**
 * Deletes a subtask in editing mode.
 * @param {number} i - The index of the subtask.
 */
function deleteSubtaskEdit(i) {
    taskDataEdit.subtasks.splice(i, 1);
    renderSubtasksEdit();
};
