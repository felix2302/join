function clearAll() {
    clearAllInputs();
    checkedContacts = [];
    clearTaskDataArray();
    renderSignList();
    changeUrgency("mid");
    renderSubtasks();
};

function getUrgency() {
    for (let i = 0; i < activeUrg.length; i++) {
        const urg = activeUrg[i];
        if (urg.active === true) {
            taskData.priority = urg.urgency;
        }
    }
};

function changeBgBtn() {
    if (activeUrg[0].active === true) {
        highlightButton("high");
    }
    if (activeUrg[1].active === true) {
        highlightButton("mid");
    }
    if (activeUrg[2].active === true) {
        highlightButton("low");
    }
};

/**
 * Highlights the button corresponding to the given urgency level.
 * @param {string} urg - The urgency level.
 */
function highlightButton(urg) {
    if (urg === "high") {
        document.getElementById("high").classList.add("high-focus");
        document.getElementById("mid").classList.remove("mid-focus");
        document.getElementById("low").classList.remove("low-focus");
        document.getElementById("img-high").src = `../assets/icons-addtask/prio-high-white.png`;
        document.getElementById("img-mid").src = `../assets/icons-addtask/prio-mid-color.png`;
        document.getElementById("img-low").src = `../assets/icons-addtask/prio-low-color.png`;
    } else if (urg === "mid") {
        document.getElementById("high").classList.remove("high-focus");
        document.getElementById("mid").classList.add("mid-focus");
        document.getElementById("low").classList.remove("low-focus");
        document.getElementById("img-high").src = `../assets/icons-addtask/prio-high-color.png`;
        document.getElementById("img-mid").src = `../assets/icons-addtask/prio-mid-white.png`;
        document.getElementById("img-low").src = `../assets/icons-addtask/prio-low-color.png`;
    } else if (urg === "low") {
        document.getElementById("high").classList.remove("high-focus");
        document.getElementById("mid").classList.remove("mid-focus");
        document.getElementById("low").classList.add("low-focus");
        document.getElementById("img-high").src = `../assets/icons-addtask/prio-high-color.png`;
        document.getElementById("img-mid").src = `../assets/icons-addtask/prio-mid-color.png`;
        document.getElementById("img-low").src = `../assets/icons-addtask/prio-low-white.png`;
    }
};

/**
 * Hides the subtask warning.
 */
function hideWarning() {
    document.getElementById("subtasksInput").value = "";
    document.getElementById("subtaskInputCont").style.borderColor = "";
    document.getElementById("requiredSubtext").innerHTML = "Cannot set empty subtask";
    document.getElementById("requiredSubtext").style.display = "none";
};

/**
 * Shows the subtask warning.
 */
function showWarning() {
    document.getElementById("subtaskInputCont").style.borderColor = "red";
    document.getElementById("requiredSubtext").style.display = "block";
    document.getElementById("subtasksInput").focus();
};

/**
 * Handles hover effect on buttons.
 * @param {boolean} boolean - Indicates if the mouse is hovering over the button.
 * @param {string} id - The id of the button.
 */
function hoverBtn(boolean, id) {
    if (boolean === true && id === "img-high") {
        document.getElementById(id).src = "../assets/icons-addtask/prio-high-white.png";
    } else if (boolean === false && id === "img-high" && activeUrg[0].active === false) {
        document.getElementById(id).src = "../assets/icons-addtask/prio-high-color.png";
    }
    if (boolean === true && id === "img-mid") {
        document.getElementById(id).src = "../assets/icons-addtask/prio-mid-white.png";
    } else if (boolean === false && id === "img-mid" && activeUrg[1].active === false) {
        document.getElementById(id).src = "../assets/icons-addtask/prio-mid-color.png";
    }
    if (boolean === true && id === "img-low") {
        document.getElementById(id).src = "../assets/icons-addtask/prio-low-white.png";
    } else if (boolean === false && id === "img-low" && activeUrg[2].active === false) {
        document.getElementById(id).src = "../assets/icons-addtask/prio-low-color.png";
    }
};

/**
 * Changes the task close icon on mouse enter.
 */
function enterIcon() {
    document.getElementById("task-x").src = "../assets/icons-addtask/clear-blue.png";
};

/**
 * Changes the task close icon on mouse leave.
 */
function outIcon() {
    document.getElementById("task-x").src = "../assets/icons-addtask/clear-black.png";
};

/**
 * Opens the categories dropdown.
 */
function openCategorys() {
    document.getElementById("dropdownCategoryToggle").style.display = "none";
    document.getElementById("dropdownCategoryContainer").style.display = "";
    document.getElementById("dropdownCategorys").style.display = "flex";
    renderTaskList();
};

/**
 * Closes the categories dropdown.
 * @param {Event} ev
 */
function closeCategorys(ev) {
    ev.stopPropagation();
    document.getElementById("dropdownCategoryToggle").style.display = "";
    document.getElementById("dropdownCategoryContainer").style.display = "none";
    document.getElementById("dropdownCategorys").style.display = "none";
};

/**
 * Opens the calendar for date selection.
 */
function openCalender() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("taskDate").setAttribute('min', today);
    document.getElementById("taskDate").showPicker();
    document.getElementById("taskDate").style.color = "black";
};

/**
 * Returns the HTML for the task list.
 * @param {string} category - The category name.
 * @param {number} i - The index of the category.
 * @returns {string} The HTML string for the task list item.
 */
function returnTaskListHTML(category, i) {
    return `
        <div onclick="addCategory(${i}); closeCategorys(event);" class="category-dd-item" id="ctg${i}">
            <div class="task-cnt-name">${category}</div>
        </div>
        `;
};

/**
 * Displays the contacts dropdown.
 * @param {string} ev - The event type ("open" or "close").
 */
function displayContacts(ev) {
    if (ev === "open") {
        document.getElementById("dropdownMenuContainer").style.display = "";
        document.getElementById("dropdownMenu").style.display = "block";
    } else if (ev === "close") {
        document.getElementById("dropdownMenuContainer").style.display = "none";
        document.getElementById("dropdownMenu").style.display = "none";
    }
};

/**
 * Returns the HTML for a contact list item.
 * @param {Object} cnt - The contact object.
 * @param {number} i - The index of the contact.
 * @returns {string} The HTML string for the contact list item.
 */
function returnContactList(cnt, i) {
    return `
        <div onclick="assignContact(${i})" class="dropdown-item" id="cntnum${i}" data-value="${i}">
            <div class="task-cnt-sign flex-center" id="contactsign${i}" style="background-color: ${cnt.color};">${getInitials(cnt.name)}</div>
            <div class="task-cnt-name">${cnt.name}</div>
            <img id="cntimg${i}" src="../assets/icons/rb-unchecked.png" alt="check">
        </div>
    `;
};

/**
 * Displays the assignment status of a contact.
 * @param {string} check - The assignment status ("checked" or "unchecked").
 * @param {number} i - The index of the contact.
 */
function displayAssignments(check, i) {
    if (check === "checked") {
        document.getElementById(`cntimg${i}`).src = "../assets/icons/rb-checked.png";
        document.getElementById(`cntnum${i}`).classList.add("bg-darkblue");
        document.getElementById(`cntnum${i}`).classList.add("task-hover-dark");
        document.getElementById(`cntnum${i}`).classList.add("color-white");
    } else if (check === "unchecked") {
        document.getElementById(`cntimg${i}`).src = "../assets/icons/rb-unchecked.png";
        document.getElementById(`cntnum${i}`).classList.remove("bg-darkblue");
        document.getElementById(`cntnum${i}`).classList.remove("color-white");
        document.getElementById(`cntnum${i}`).classList.remove("task-hover-dark");
    }
};

/**
 * Returns the HTML for a sign list item.
 * @param {Object} cnt - The contact object.
 * @param {number} i - The index of the contact.
 * @returns {string} The HTML string for the sign list item.
 */
function returnSignList(cnt, i) {
    return `
           <div class="task-cnt-assigned-sign">
                <div class="task-cnt-sign flex-center" id="contactsign${i}" style='background-color:${cnt.color}'>
                ${getInitials(cnt.name)}
                </div>
           </div>`;
};

/**
 * Adds a category to the task.
 * @param {number} i - The index of the category to add.
 */
function addCategory(i) {
    if (taskData.category === "") {
        taskData.category = availableCategorys[i];
    } else {
        taskData.category = "";
        taskData.category = availableCategorys[i];
    }
    document.getElementById("categoryInput").value = `${taskData.category}`;
};


/**
 * Returns the HTML for a subtask list item.
 * @param {Object} subtask - The subtask object.
 * @param {number} i - The index of the subtask.
 * @returns {string} The HTML string for the subtask list item.
 */
function returnSubtasksList(subtask, i) {
    return `
        <div id="subtask${i}">
            <div class="subtask-item">
                <li>${subtask.text}</li>
                <div class="img-cont-subtask flex-center">
                    <div onclick="editSubtask(${i})" class="img-cont-subtask-first img-cont-subtask">
                        <img src="../assets/icons/edit.png" alt="">
                    </div>
                    <div onclick="deleteSubtask(${i})" class="img-cont-subtask-last">
                        <img src="../assets/icons/delete.png" alt="">
                    </div>
                </div>
            </div>
        </div>
       `;
};

/**
 * Returns the HTML for editing a subtask.
 * @param {number} i - The index of the subtask.
 * @returns {string} The HTML string for editing the subtask.
 */
function returnEditSubtaskHTML(i) {
    return `
            <div onkeydown="checkEditKey(event, ${i})" class="edit-subtask-item">
                <input id="editedValue" type="text" class="editable-input" value="${taskData.subtasks[i].text}">
                <div class="img-cont-subtask flex-center">
                    <div onclick="deleteSubtask(${i})" class="img-cont-subtask-first img-cont-subtask">
                        <img src="../assets/icons/delete.png" alt="">
                    </div>
                    <div onclick="saveSubtask(${i})" class="img-cont-subtask-last">
                        <img src="../assets/icons/hook-small-dark.png" alt="">
                    </div>
                </div>
            </div>
    `;
};

/**
 * Returns the HTML for the subtask input field.
 * @returns {string} The HTML string for the subtask input field.
 */
function returnSubtaskImg() {
    return `
    <div onclick="clearInputfield()" class=" img-cont-subtask-first-n img-cont-subtask">
        <img src="../assets/icons/x-black.png" alt="">
    </div>
    <div onclick="addSubtask()" class="img-cont-subtask">
        <img src="../assets/icons/hook-small-dark.png" alt="">
    </div>
    `;
};

/**
 * Shows form validation feedback.
 */
function formValidationFeedbackOn() {
    document.getElementById("taskTitle").style.borderColor = "red";
    document.getElementById("requiredTitle").style.display = "";
    document.getElementById("taskDate").style.borderColor = "red";
    document.getElementById("requiredDate").style.display = "";
    document.getElementById("dropdownCategoryToggle").style.borderColor = "red";
    document.getElementById("requiredCategorys").style.display = "";
};

/**
 * Hides form validation feedback.
 */
function formValidationFeedbackOff() {
    document.getElementById("taskTitle").style.borderColor = "";
    document.getElementById("requiredTitle").style.display = "none";
    document.getElementById("taskDate").style.borderColor = "";
    document.getElementById("requiredDate").style.display = "none";
    document.getElementById("dropdownCategoryToggle").style.borderColor = "";
    document.getElementById("requiredCategorys").style.display = "none";
};


function succesfullAdded() {
    document.getElementById("succesImgCnt").style.display = "flex";
    void document.getElementById("succesImg").offsetWidth;
    document.getElementById("succesImg").style.transform = "translateY(0px)";
};

function succesfullAddedClose() {
    document.getElementById("succesImgCnt").style.display = "none";
    void document.getElementById("succesImg").offsetWidth;
    document.getElementById("succesImg").style.transform = "translateY(500px)";
};

/**
 * Edits a subtask.
 * @param {number} i
 */
function editSubtask(i) {
    document.getElementById(`subtask${i}`).innerHTML = returnEditSubtaskHTML(i);
    document.getElementById("editedValue").focus();
    document.getElementById("editedValue").select();
};

function openSubtasks() {
    let imgContainer = document.getElementById("subtaskImgCont");
    document.getElementById("subtasksInput").focus();
    imgContainer.innerHTML = "";
    imgContainer.innerHTML = returnSubtaskImg();
};

/**
 * Closes the subtasks input field.
 * @param {Event} ev
 */
function closeSubtasks(ev) {
    ev.stopPropagation();
    document.getElementById("subtaskInputCont").style.borderColor = "";
    document.getElementById("requiredSubtext").style.display = "none";
    let imgContainer = document.getElementById("subtaskImgCont");
    imgContainer.innerHTML = "";
    imgContainer.innerHTML = `
    <div class="img-cont-subtask">
        <img src="../assets/icons/add.png" alt="">
    </div>
    `;
};