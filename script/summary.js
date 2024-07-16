
let todosArray = [];
let inProgressArray = [];
let awaitFeedbackArray = [];
let doneArray = [];
let urgentArray = [];

/**
 * Initializes the summary page.
 * @returns {Promise<void>}
 */
async function sumStart() {
    checkForPreviousPage();
    await includeHTML();
    await renderPage();
    document.getElementById("firstRowCont1").classList.add("bg-darkblue");
    document.getElementById("firstRowCont2").classList.add("bg-darkblue");
    setBackground(0);
};

/**
 * Renders the summary page with tasks data.
 * @returns {Promise<void>}
 */
async function renderPage() {
    let tasks = await loadData(TASKS_URL);
    if (tasks !== undefined) {
        document.getElementById("sumBody").innerHTML = "";
        document.getElementById("sumBody").innerHTML = returnSummaryHTML(tasks);
    }
};

/**
 * Gets the count of 'todo' tasks.
 * @param {Array} t - Array of tasks.
 * @returns {number} The count of 'todo' tasks.
 */
function getTodos(t) {
    let todos = t.filter(task => task.status === "todo");
    return todos.length !== 0 ? todos.length : 0;
};

/**
 * Gets the count of 'done' tasks.
 * @param {Array} t - Array of tasks.
 * @returns {number} The count of 'done' tasks.
 */
function getDone(t) {
    let dones = t.filter(task => task.status === "done");
    return dones.length !== 0 ? dones.length : 0;
};

/**
 * Gets the count of high priority tasks.
 * @param {Array} t - Array of tasks.
 * @returns {number} The count of high priority tasks.
 */
function getUrgent(t) {
    let urgents = t.filter(task => task.priority === "high");
    return urgents.length !== 0 ? urgents.length : 0;
};

/**
 * Gets the earliest due date of high priority tasks.
 * @param {Array} t - Array of tasks.
 * @returns {string} The earliest due date of high priority tasks or "--.--.----" if none exist.
 */
function getUrgentDate(t) {
    let urgents = t.filter(task => task.priority === "high");
    if (urgents.length !== 0) {
        let dateString = getUpcomingUrgentDate(urgents);
        return formatDate(dateString);
    } else {
        return "--.--.----";
    }
};

/**
 * Gets the total count of tasks.
 * @param {Array} t - Array of tasks.
 * @returns {number} The total count of tasks.
 */
function getTasksLength(t) {
    return t.length !== 0 ? t.length : 0;
};

/**
 * Gets the count of 'inprogress' tasks.
 * @param {Array} t - Array of tasks.
 * @returns {number} The count of 'inprogress' tasks.
 */
function getInProgress(t) {
    let inProgress = t.filter(task => task.status === "inprogress");
    return inProgress.length !== 0 ? inProgress.length : 0;
};

/**
 * Gets the count of 'awaitfeedback' tasks.
 * @param {Array} t - Array of tasks.
 * @returns {number} The count of 'awaitfeedback' tasks.
 */
function getAwaitingFeedback(t) {
    let awaitFeedback = t.filter(task => task.status === "awaitfeedback");
    return awaitFeedback.length !== 0 ? awaitFeedback.length : 0;
};

/**
 * Gets the earliest due date from an array of high priority tasks.
 * @param {Array} urgents - Array of high priority tasks.
 * @returns {string} The earliest due date.
 */
function getUpcomingUrgentDate(urgents) {
    let prioDates = [];
    urgents.forEach(task => {
        prioDates.push(task.due_date);
    });
    let sortedDates = prioDates.sort(function (a, b) {
        return new Date(a) - new Date(b);
    });
    return sortedDates[0];
};

/**
 * Checks for the previous page and triggers a greeting animation if navigated from index.html.
 */
function checkForPreviousPage() {
    let previousPage = document.referrer;
    if (previousPage.includes("index.html")) {
        greetingAnimation();
    }
};

/**
 * Displays a greeting animation.
 */
function greetingAnimation() {
    let container = document.getElementById("greetingBg");
    container.style.display = "";
    let content = document.getElementById("greetingContent");
    content.innerHTML = "";
    content.innerHTML = returnGreetingHTML();
    setTimeout(() => {
        container.style.opacity = "0%";
        setTimeout(() => {
            container.style.display = "none";
        }, 600);
    }, 1500);
};

/**
 * Gets the appropriate greeting based on the current time.
 * @returns {string} The greeting message.
 */
function getActualGreet() {
    let today = new Date();
    let hourNow = today.getHours();
    if (hourNow <= 12 && hourNow >= 0) {
        return "Good morning";
    } else if (hourNow >= 12 && hourNow <= 18) {
        return "Good afternoon";
    } else if (hourNow >= 18 && hourNow <= 24) {
        return "Good evening";
    } else {
        return "Welcome";
    }
};

/**
 * Gets the name of the active user.
 * @returns {string} The name of the active user or an empty string for guest users.
 */
function getUser() {
    return activeUser.name !== "Gast Nutzer" ? activeUser.name : "";
};

/**
 * Returns the HTML string for the summary page.
 * @param {Array} tasks - Array of tasks.
 * @returns {string} The HTML string for the summary page.
 */
function returnSummaryHTML(tasks) {
    return `
        <div class="flex-center summary-headline mgn-l-328">
            <h1>Join 360</h1>
            <img class="sum-headbar" src="../assets/img/bar-blue.png" alt="bar">
            <h3>Key Metrics at a Glance</h3>
        </div>
        <div class="flex-center summary-headline2 mgn-l-328">
            <h1>Join 360</h1>
            <h3>Key Metrics at a Glance</h3>
            <div class="sum-bluebar-cont">
                <img src="../assets/img/bar-blue-horizontal.png" alt="bar">
            </div>
        </div>
        <div class="flex-row sum-stats-cont mgn-l-328">
            <div class="summary-stats flex-column">
                <div class="flex-row sum-first-row">
                    <a href="./board.html" onmouseenter="changeColor1()" onmouseleave="recreateColor1()"
                        class="sum-first-row-cont flex-center flex-row">
                        <div id="firstRowCont1" class="flex-center sum-icon-container">
                            <img id="sumEdit" src="../assets/icons/edit-white.svg" alt="">
                        </div>
                        <div class="sum-number-container flex-center flex-column">
                            <div class="sum-number">${getTodos(tasks)}</div>
                            <p>To-do</p>
                        </div>
                    </a>
                    <a href="./board.html" onmouseover="changeColor2()" onmouseleave="recreateColor2()"
                        class="sum-first-row-cont flex-center flex-row">
                        <div id="firstRowCont2" class="flex-center sum-icon-container">
                            <img id="sumHook" src="../assets/icons/hook-sum-white.png" alt="">
                        </div>
                        <div class="sum-number-container flex-center flex-column">
                            <div class="sum-number">${getDone(tasks)}</div>
                            <p>Done</p>
                        </div>
                    </a>
                </div>
                <a href="./board.html">
                    <div class="sum-sec-row flex-row flex-center">
                        <div class="sum-urgency">
                            <div class="flex-center sum-icon-container bg-red">
                                <img class="" src="../assets/icons-addtask/prio-high-white.png" alt="">
                            </div>
                            <div class="flex-center flex-column">
                                <div class="sum-number">${getUrgent(tasks)}</div>
                                <p>Urgent</p>
                            </div>
                        </div>
                        <img class="sum-grey-bar" src="../assets/img/bar-grey.png" alt="">
                        <div class="sum-date flex-center flex-column">
                            <p><b>${getUrgentDate(tasks)}</b></p>
                            <p class="sum-dateline">Upcoming Deadline</p>
                        </div>
                    </div>
                </a>
                <div class="sum-third-row flex-row flex-center">
                    <a class="sum-third-cont flex-center bg-white" href="./board.html">
                        <div class="sum-third-parent flex-center flex-column">
                            <div class="sum-big-number">${getTasksLength(tasks)}</div>
                            <p class="text-center">Tasks in Board</p>
                        </div>
                    </a>
                    <a class="sum-third-cont flex-center bg-white" href="./board.html">
                        <div class="sum-third-parent flex-center flex-column">
                            <div class="sum-big-number">${getInProgress(tasks)}</div>
                            <p class="text-center">Tasks in Progress</p>
                        </div>
                    </a>
                    <a class="sum-third-cont flex-center bg-white" href="./board.html">
                        <div class="sum-third-parent flex-center flex-column">
                            <div class="sum-big-number">${getAwaitingFeedback(tasks)}</div>
                            <p class="text-center">Awaiting Feedback</p>
                        </div>
                    </a>
                </div>
            </div>
            <div class="sum-greet-cont flex-center flex-column">
                <h2 class="color-darkblue">${getActualGreet()}</h2>
                <h1 class="color-lightblue">${getUser()}</h1>
            </div>
        </div>
    `;
};

/**
 * Returns the HTML string for the greeting.
 * @returns {string} The HTML string for the greeting.
 */
function returnGreetingHTML() {
    return `
        <div class="login-greet-cont flex-center flex-column">
            <h2 class="color-darkblue">${getActualGreet()}</h2>
            <h1 class="color-lightblue">${getUser()}</h1>
        </div>
    `;
};

/**
 * Changes the color of the first row container on mouse enter.
 */
function changeColor1() {
    document.getElementById("firstRowCont1").classList.remove("bg-darkblue");
    document.getElementById('firstRowCont1').classList.add("bg-white");
    document.getElementById("sumEdit").src = "../assets/icons/edit-black.svg";
};

/**
 * Recreates the color of the first row container on mouse leave.
 */
function recreateColor1() {
    document.getElementById('firstRowCont1').classList.remove("bg-white");
    document.getElementById("firstRowCont1").classList.add("bg-darkblue");
    document.getElementById("sumEdit").src = "../assets/icons/edit-white.svg";
};

/**
 * Changes the color of the second row container on mouse enter.
 */
function changeColor2() {
    document.getElementById("firstRowCont2").classList.remove("bg-darkblue");
    document.getElementById('firstRowCont2').classList.add("bg-white");
    document.getElementById("sumHook").src = "../assets/icons/hook-sum-dark.png";
};

/**
 * Recreates the color of the second row container on mouse leave.
 */
function recreateColor2() {
    document.getElementById("firstRowCont2").classList.add("bg-darkblue");
    document.getElementById('firstRowCont2').classList.remove("bg-white");
    document.getElementById("sumHook").src = "../assets/icons/hook-sum-white.png";
};
