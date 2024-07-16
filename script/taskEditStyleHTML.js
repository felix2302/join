/**
 * Array to store urgency levels and their active states for task editing.
 * @type {Array<{urgency: string, active: boolean}>}
 */
let activeUrgEdit = [
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


/**
 * Returns the HTML string for the subtask list in editing mode.
 * @param {Object} subtask - The subtask object.
 * @param {number} i - The index of the subtask.
 * @returns {string} The HTML string for the subtask list.
 */
function returnSubtasksListEdit(subtask, i) {
    return `
        <div id="subtaskEdit${i}">
            <div class="subtask-item">
                <li>${subtask.text}</li>
                <div class="img-cont-subtask flex-center">
                    <div onclick="editSubtaskEdit(${i})" class="img-cont-subtask-first img-cont-subtask">
                        <img src="../assets/icons/edit.png" alt="">
                    </div>
                    <div onclick="deleteSubtaskEdit(${i})" class="img-cont-subtask-last">
                        <img src="../assets/icons/delete.png" alt="">
                    </div>
                </div>
            </div>
        </div>
       `;
};

/**
 * Returns the HTML string for editing a subtask.
 * @param {number} i - The index of the subtask.
 * @returns {string} The HTML string for editing the subtask.
 */
function returnEditSubtaskHTMLEdit(i) {
    return `
            <div onkeydown="checkEditKeyEdit(event, ${i})" class="edit-subtask-item">
                <input id="editedValueEdit" type="text" class="editable-input" value="${taskDataEdit.subtasks[i].text}">
                <div class="img-cont-subtask flex-center">
                    <div onclick="deleteSubtaskEdit(${i})" class="img-cont-subtask-first img-cont-subtask">
                        <img src="../assets/icons/delete.png" alt="">
                    </div>
                    <div onclick="saveSubtaskEdit(${i})" class="img-cont-subtask-last">
                        <img src="../assets/icons/hook-small-dark.png" alt="">
                    </div>
                </div>
            </div>
    `;
};

/**
 * Returns the HTML string for the contact list in editing mode.
 * @param {Object} cnt - The contact object.
 * @param {number} i - The index of the contact.
 * @returns {string} The HTML string for the contact list.
 */
function returnContactListEdit(cnt, i) {
    return `
        <div onclick="assignContactEdit(${i})" class="dropdown-item" id="cntnumEdit${i}" data-value="${i}">
            <div class="task-cnt-sign flex-center" id="contactsignEdit${i}" style="background-color: ${cnt.color};">${getInitials(cnt.name)}</div>
            <div class="task-cnt-name">${cnt.name}</div>
            <img id="cntimgEdit${i}" src="../assets/icons/rb-unchecked.png" alt="check">
        </div>
    `;
};

/**
 * Returns the HTML string for the subtask input field in editing mode.
 * @returns {string} The HTML string for the subtask input field.
 */
function returnSubtaskImgEdit() {
    return `
    <div onclick="clearInputfieldEdit()" class=" img-cont-subtask-first-n img-cont-subtask">
        <img src="../assets/icons/x-black.png" alt="">
    </div>
    <div onclick="addSubtaskEdit()" class="img-cont-subtask">
        <img src="../assets/icons/hook-small-dark.png" alt="">
    </div>
    `;
};

/**
 * Opens the status dropdown for editing.
 */
function openStatusEdit() {
    document.getElementById("dropdownCategoryToggleEdit").style.display = "none";
    document.getElementById("dropdownCategoryContainerEdit").style.display = "";
    document.getElementById("dropdownCategorysEdit").style.display = "flex";
    renderStatusListEdit();
};

/**
 * Closes the status dropdown for editing.
 * @param {Event} ev
 */
function closeStatusEdit(ev) {
    ev.stopPropagation();
    document.getElementById("dropdownCategoryToggleEdit").style.display = "";
    document.getElementById("dropdownCategoryContainerEdit").style.display = "none";
    document.getElementById("dropdownCategorysEdit").style.display = "none";
};

/**
 * Returns the HTML string for a task list item with the given status and index.
 * @param {string} status - The status of the task.
 * @param {number} i - The index of the task.
 * @returns {string} The HTML string for the task list item.
 */
function returnTaskListHTMLEdit(status, i) {
    return `
        <div onclick="addStatusEdit(${i}); closeStatusEdit(event);" class="category-dd-item task-form-font" id="ctg${i}">
            <div class="task-cnt-name">${status}</div>
        </div>
    `;
};

/**
 * Displays the contacts dropdown for editing.
 * @param {string} ev - The event type ("open" or "close").
 */
function displayContactsEdit(ev) {
    if (ev === "open") {
        document.getElementById("dropdownMenuContainerEdit").style.display = "";
        document.getElementById("dropdownMenuEdit").style.display = "block";
    } else if (ev === "close") {
        document.getElementById("dropdownMenuContainerEdit").style.display = "none";
        document.getElementById("dropdownMenuEdit").style.display = "none";
    }
};

/**
 * Displays the assignment status for editing.
 * @param {string} check - The assignment status ("checked" or "unchecked").
 * @param {number} i - The index of the contact.
 */
function displayAssignmentsEdit(check, i) {
    if (check === "checked") {
        document.getElementById(`cntimgEdit${i}`).src = "../assets/icons/rb-checked.png";
        document.getElementById(`cntnumEdit${i}`).classList.add("bg-darkblue");
        document.getElementById(`cntnumEdit${i}`).classList.add("task-hover-dark");
        document.getElementById(`cntnumEdit${i}`).classList.add("color-white");
    } else if (check === "unchecked") {
        document.getElementById(`cntimgEdit${i}`).src = "../assets/icons/rb-unchecked.png";
        document.getElementById(`cntnumEdit${i}`).classList.remove("bg-darkblue");
        document.getElementById(`cntnumEdit${i}`).classList.remove("color-white");
        document.getElementById(`cntnumEdit${i}`).classList.remove("task-hover-dark");
    }
};

/**
 * Returns the HTML string for the sign list in editing mode.
 * @param {Object} cnt - The contact object.
 * @param {number} i - The index of the contact.
 * @returns {string} The HTML string for the sign list.
 */
function returnSignListEdit(cnt, i) {
    return `
           <div class="task-cnt-assigned-sign">
                <div class="task-cnt-sign flex-center" id="contactsignEdit${i}" style='background-color:${cnt.color}'>
                ${getInitials(cnt.name)}
                </div>
           </div>`;
};

/**
 * Changes the background button color for editing based on urgency.
 */
function changeBgBtnEdit() {
    if (activeUrgEdit[0].active === true) {
        highlightButtonEdit("high");
    }
    if (activeUrgEdit[1].active === true) {
        highlightButtonEdit("mid");
    }
    if (activeUrgEdit[2].active === true) {
        highlightButtonEdit("low");
    }
};

/**
 * Handles hover effect on urgency buttons for editing.
 * @param {boolean} boolean - Indicates if the mouse is hovering over the button.
 * @param {string} id - The id of the button.
 */
function hoverBtnEdit(boolean, id) {
    if (boolean === true && id === "img-highEdit") {
        document.getElementById(id).src = "../assets/icons-addtask/prio-high-white.png";
    } else if (boolean === false && id === "img-highEdit" && activeUrgEdit[0].active === false) {
        document.getElementById(id).src = "../assets/icons-addtask/prio-high-color.png";
    }
    if (boolean === true && id === "img-midEdit") {
        document.getElementById(id).src = "../assets/icons-addtask/prio-mid-white.png";
    } else if (boolean === false && id === "img-midEdit" && activeUrgEdit[1].active === false) {
        document.getElementById(id).src = "../assets/icons-addtask/prio-mid-color.png";
    }
    if (boolean === true && id === "img-lowEdit") {
        document.getElementById(id).src = "../assets/icons-addtask/prio-low-white.png";
    } else if (boolean === false && id === "img-lowEdit" && activeUrgEdit[2].active === false) {
        document.getElementById(id).src = "../assets/icons-addtask/prio-low-color.png";
    }
};

/**
 * Highlights the urgency button in editing mode.
 * @param {string} urg - The urgency level.
 */
function highlightButtonEdit(urg) {
    if (urg === "high") {
        document.getElementById("highEdit").classList.add("high-focus");
        document.getElementById("midEdit").classList.remove("mid-focus");
        document.getElementById("lowEdit").classList.remove("low-focus");
        document.getElementById("img-highEdit").src = `../assets/icons-addtask/prio-high-white.png`;
        document.getElementById("img-midEdit").src = `../assets/icons-addtask/prio-mid-color.png`;
        document.getElementById("img-lowEdit").src = `../assets/icons-addtask/prio-low-color.png`;
    } else if (urg === "mid") {
        document.getElementById("highEdit").classList.remove("high-focus");
        document.getElementById("midEdit").classList.add("mid-focus");
        document.getElementById("lowEdit").classList.remove("low-focus");
        document.getElementById("img-highEdit").src = `../assets/icons-addtask/prio-high-color.png`;
        document.getElementById("img-midEdit").src = `../assets/icons-addtask/prio-mid-white.png`;
        document.getElementById("img-lowEdit").src = `../assets/icons-addtask/prio-low-color.png`;
    } else if (urg === "low") {
        document.getElementById("highEdit").classList.remove("high-focus");
        document.getElementById("midEdit").classList.remove("mid-focus");
        document.getElementById("lowEdit").classList.add("low-focus");
        document.getElementById("img-highEdit").src = `../assets/icons-addtask/prio-high-color.png`;
        document.getElementById("img-midEdit").src = `../assets/icons-addtask/prio-mid-color.png`;
        document.getElementById("img-lowEdit").src = `../assets/icons-addtask/prio-low-white.png`;
    }
};

/**
 * Closes the subtasks input field for editing.
 * @param {Event} ev
 */
function closeSubtasksEdit(ev) {
    ev.stopPropagation();
    document.getElementById("subtaskInputContEdit").style.borderColor = "";
    document.getElementById("requiredSubtextEdit").style.display = "none";
    let imgContainer = document.getElementById("subtaskImgContEdit");
    imgContainer.innerHTML = "";
    imgContainer.innerHTML = `
    <div class="img-cont-subtask">
        <img src="../assets/icons/add.png" alt="">
    </div>
    `;
};