function generateTicketHTML(element, categoryBG) {
    let subtaskProgressHTML = getSubtasksProgress(element);
    let assignedHTML = getContacts(element);

    return `
        <div id="board-ticket${element['id']}" class="board-ticket" draggable="true" ondragstart="startDragging('${element['id']}')" ondragend="endDragging('${element['id']}')" onclick="showTask('${element['id']}')">
            <div class="board-ticket-content flex-column">
                <div class="board-ticket-gategory ${categoryBG}-bg">${element['category']}</div>
                <div class="board-ticket-description">
                    <div class="board-ticket-headline">${element['title']}</div>
                    <div class="board-ticket-task">${element['description']}</div>
                </div>
                ${subtaskProgressHTML}
                <div class="flex-row flex-sb flex-center">
                    <div class="board-ticket-assigned-container flex-row">
                        ${assignedHTML}
                    </div>
                    <div class="board-ticket-priority">
                        <img src="../assets/icons-addtask/prio-${element['priority']}-color.png" alt="priority">
                     </div>
                </div>
            </div>
        </div>`;
};

function getContacts(element) {

    let assignedHTML = '';
    if (!element['assigned_to']) {
        return assignedHTML;
    } else {
        if (element['assigned_to'].length > 3) {
            let initials = element['assigned_to'][0].initials;
            assignedHTML += `<div class="board-ticket-assigned flex-center" style="background-color:${element['assigned_to'][0].color}">${initials}</div><div class="board-ticket-assigned flex-center" style="background-color: rgba(255, 116, 94, 1)">+${element['assigned_to'].length - 1}</div>`;
        } else {
            for (let j = 0; j < element['assigned_to'].length; j++) {
                let initials = element['assigned_to'][j].initials;
                assignedHTML += `<div class="board-ticket-assigned flex-center" style="background-color:${element['assigned_to'][j].color}">${initials}</div>`;
            }
        }
        return assignedHTML;
    }
}

function getSubtasksProgress(element) {
    let subtasks = element['subtasks'];
    if (element['subtasks']) {
        let subtasksLength = element['subtasks'].length;

        if (subtasksLength > 0) {
            let checkedSubtasks = subtasks.filter(cs => cs['status'] === 'checked');
            let checkedSubtasksLength = checkedSubtasks.length;
            let subtaskProgress = (checkedSubtasksLength / subtasksLength) * 100;
            return `
            <div id="board-ticket-statusbar" class="board-ticket-statusbar flex-row flex-center">
                <div class="board-ticket-bar">
                    <div id="board-ticket-bar-progress" style="width: ${subtaskProgress}%"></div>
                </div>
                <div class="board-ticket-progress">${checkedSubtasksLength}/${subtasksLength} Subtasks</div>
            </div>`
                ;
        } else {
            return '';
        }
    }
    else {
        return '';
    }
};


function generatePlaceholderHTML() {
    return `<div class="board-no-tasks-placeholder flex-center">No tasks to do</div>`
};

