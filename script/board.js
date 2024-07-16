let tasksArray = [];
let filteredTasks = [];
let currentDraggedElement;

/**
 * Fetches tasks from the server and initializes the board if tasks are available.
 */
async function getTasks() {
    tasksArray = await loadData(TASKS_URL);
    if (tasksArray.length > 0) {
        initBoard();
    }
};

/**
 * Initializes the board by updating task lists and setting the background.
 */
async function initBoard() {
    await includeHTML();    
    setBackground(2);
    await updateTodos();
    await updateInProgress();
    await updateAwaitFeedback();
    await updateDone();
    prepareTask();
};

/**
 * Updates tasks in the specified container based on their status.
 * @param {string} status - The status of the tasks to be updated.
 * @param {string} containerId - The ID of the container where tasks will be updated.
 */
async function updateTasksByStatus(status, containerId) {
    if (tasksArray.length === 0) {
        await getTasks();
    }
    let tasks = tasksArray.filter(t => t['status'] === status);
    let container = document.getElementById(containerId);
    container.innerHTML = '';
    if (tasks.length > 0) {
        let taskHTML = '';
        for (let i = 0; i < tasks.length; i++) {
            const element = tasks[i];
            let categoryBG = element['category'].replace(/\s+/g, '-').toLowerCase();
            taskHTML += generateTicketHTML(element, categoryBG);
        }
        container.innerHTML = taskHTML;
    } else {
        container.innerHTML = generatePlaceholderHTML();
    }
};

/**
 * Updates the "To Do" tasks.
 */
async function updateTodos() {
    await updateTasksByStatus('todo', 'board-ticket-container-todo');
};

/**
 * Updates the "In Progress" tasks.
 */
async function updateInProgress() {
    await updateTasksByStatus('inprogress', 'board-ticket-container-in-progress');
};

/**
 * Updates the "Awaiting Feedback" tasks.
 */
async function updateAwaitFeedback() {
    await updateTasksByStatus('awaitfeedback', 'board-ticket-container-await-feedback');
};

/**
 * Updates the "Done" tasks.
 */
async function updateDone() {
    await updateTasksByStatus('done', 'board-ticket-container-done');
};

/**
 * Filters tasks based on the input value and updates the task lists.
 * @param {string} inputId - The ID of the input element used for filtering tasks.
 */
function startFilterTasks(inputId) {
    const search = document.getElementById(inputId).value.toLowerCase();
    if (search.length >= 2) {
        filterTasks(search)
    } else {
        initBoard();
    }
};

/**
 * Filters tasks based on the search string and updates the task lists.
 * @param {string} search - The search string used to filter tasks.
 */
function filterTasks(search) {
    filteredTasks = tasksArray.filter(task => task.title.toLowerCase().includes(search));
    updateFilteredTodos();
    updateFilteredInProgress();
    updateFilteredAwaitFeedback();
    updateFilteredDone();
};

/**
 * Updates filtered tasks in the specified container based on their status.
 * @param {string} status - The status of the tasks to be updated.
 * @param {string} containerId - The ID of the container where tasks will be updated.
 */
function updateFilteredTasks(status, containerId) {
    let tasks = filteredTasks.filter(t => t['status'] === status);
    document.getElementById(containerId).innerHTML = '';

    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        let categoryBG = element['category'].replace(/\s+/g, '-').toLowerCase();
        document.getElementById(containerId).innerHTML += generateTicketHTML(element, categoryBG);
    }

    if (document.getElementById(containerId).innerHTML === '') {
        document.getElementById(containerId).innerHTML = generatePlaceholderHTML();
    }
};

/**
 * Updates the filtered "To Do" tasks.
 */
function updateFilteredTodos() {
    updateFilteredTasks('todo', 'board-ticket-container-todo');
};

/**
 * Updates the filtered "In Progress" tasks.
 */
function updateFilteredInProgress() {
    updateFilteredTasks('inprogress', 'board-ticket-container-in-progress');
};

/**
 * Updates the filtered "Awaiting Feedback" tasks.
 */
function updateFilteredAwaitFeedback() {
    updateFilteredTasks('awaitfeedback', 'board-ticket-container-await-feedback');
};

/**
 * Updates the filtered "Done" tasks.
 */
function updateFilteredDone() {
    updateFilteredTasks('done', 'board-ticket-container-done');
};

/**
 * Starts the dragging process for a task.
 * @param {string} id - The ID of the task being dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
    document.getElementById(`board-ticket${id}`).classList.add('board-ticket-tend');
};

/**
 * Ends the dragging process for a task. Returns an error if task is not found.
 * @param {string} id - The ID of the task being dragged.
 */
function endDragging(id) {
    const element = document.getElementById(`board-ticket${id}`);
    if (element) {
        element.classList.remove('board-ticket-tend');
    } else {
        console.error(`Element with ID board-ticket${id} not found.`);
    }
};

/**
 * Allows an element to be dropped.
 * @param {DragEvent} ev - The drag event.
 */
function allowDrop(ev, contName) {
    ev.preventDefault();
    let container = document.getElementById(`board-ticket-container-${contName}`);
    if (!container.classList.contains("dashed-container")) {
        container.classList.add("dashed-container");
    }
};

/**
 * Moves a task to a specified status.
 * @param {string} status - The status to move the task to.
 */
function moveTo(status, contName) {
    document.getElementById(`board-ticket-container-${contName}`).classList.remove("dashed-container");
    const currentTask = tasksArray.find((ct) => ct['id'] === currentDraggedElement);
    currentTask['status'] = status;
    putData(TASKS_URL, tasksArray);
    initBoard();
};

/**
 * Removes the "dashed-container" class from the element with the specified container name.
 * @param {string} contName - The unique part of the container's ID.
 */
function removeDashed(contName) {
    let container = document.getElementById(`board-ticket-container-${contName}`);
    container.classList.remove("dashed-container");
}