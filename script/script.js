
const USERS_URL = "https://join-14fdc-default-rtdb.europe-west1.firebasedatabase.app/";
const TASKS_URL = "https://join-tasks-default-rtdb.europe-west1.firebasedatabase.app/";
const CONTACTS_URL = "https://join---contacts-default-rtdb.europe-west1.firebasedatabase.app/";

let backgroundColors = [
    "background: rgba(255, 122, 0, 1)",
    "background: rgba(255, 94, 179, 1)",
    "background: rgba(110, 82, 255, 1)",
    "background: rgba(147, 39, 255, 1)",
    "background: rgba(0, 190, 232, 1)",
    "background: rgba(31, 215, 193, 1)",
    "background: rgba(255, 116, 94, 1)",
    "background: rgba(255, 163, 94, 1)",
    "background: rgba(252, 113, 255, 1)",
    "background: rgba(255, 199, 1, 1)",
    "background: rgba(0, 56, 255, 1)",
    "background: rgba(195, 255, 43, 1)",
    "background: rgba(255, 230, 43, 1)",
    "background: rgba(255, 70, 70, 1)",
    "background: rgba(255, 187, 43, 1)"
];

let users = [];
let activeUser = {};

let activePage = [
    false,
    false,
    false,
    false,
    false,
    false
];

let navOpen = false;

async function initPrivate() {
    await includeHTML();
    setBackground(4);
};

/**
 * Initializes the legal page.
 * @returns {Promise<void>}
 */
async function initLegal() {
    await includeHTML();
    setBackground(5);
};

/**
 * Toggles the navigation menu.
 */
function toggleNav() {
    let subMenu = document.querySelector(".submenu");
    subMenu.classList.toggle("d-none");
    subMenu.classList.toggle("display-column");
    navOpen = !navOpen;
    document.removeEventListener("click", toggleNav);
    if (navOpen) {
        setTimeout(() => {
            document.addEventListener("click", toggleNav);
        }, 0);
    }
};

/**
 * Loads data from a given URL.
 * @param {string} url - The URL to load data from.
 * @returns {Promise<Array>} The loaded data.
 */
async function loadData(url) {
    try {
        let response = await fetch(url + ".json");
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok');
        }
        let data = await response.json();
        if (!data) {
            return [];
        }
        let dataArray = Object.keys(data).map(key => {
            return {
                id: key,
                ...data[key]
            };
        });
        return dataArray;
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
};

/**
 * Posts data to a given URL.
 * @param {string} url - The URL to post data to.
 * @param {Object} data - The data to post.
 * @returns {Promise<Object>} The posted data with ID.
 */
async function postData(url, data = {}) {
    let response = await fetch(url + ".json", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data)
    });
    let responseData = await response.json();
    let id = responseData.name;
    data.id = id;
    await fetch(`${url}/${id}.json`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return data;
};

/**
 * Puts data to a given URL.
 * @param {string} url - The URL to put data to.
 * @param {Array<Object>} dataArray - The data array to put.
 * @returns {Promise<Response>} The response.
 */
async function putData(url, dataArray = []) {
    let data = dataArray.reduce((acc, item) => {
        let { id, ...rest } = item;
        acc[id] = { id, ...rest };
        return acc;
    }, {});
    let response = await fetch(url + ".json", {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response;
};

/**
 * Puts a data object to a given URL with a specified ID.
 * @param {string} url - The URL to put data to.
 * @param {Object} data - The data to put.
 * @param {string} id - The ID of the data.
 * @returns {Promise<Object>} The result.
 */
async function putDataObject(url, data, id) {
    try {
        const response = await fetch(`${url}${id}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Fehler bei putData:', error);
    }
};

/**
 * Deletes data from a given URL with a specified ID.
 * @param {string} url - The URL to delete data from.
 * @param {string} id - The ID of the data to delete.
 * @returns {Promise<Response>} The response.
 */
async function deleteData(url, id) {
    let response = await fetch(`${url}${id}.json`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
        }
    });
    return response;
};

/**
 * Formats a date string.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
function formatDate(dateString) {
    let parts = dateString.split("-");
    return `${parts[2]} ${getMonthName(parts[1])} ${parts[0]}`;
};

/**
 * Gets the month name from a month number.
 * @param {string} monthNumber - The month number.
 * @returns {string} The month name.
 */
function getMonthName(monthNumber) {
    const monthNames = [
        "Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];
    return monthNames[monthNumber - 1];
};

/**
 * Stops the propagation of an event.
 * @param {Event} ev - The event to stop propagation.
 */
function stopProp(ev) {
    ev.stopPropagation();
};

/**
 * Prevents the default action of an event.
 * @param {Event} ev - The event to prevent default action.
 */
function preventDf(ev) {
    ev.preventDefault();
};

/**
 * Includes HTML content from external files.
 * @returns {Promise<void>}
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();

        } else {
            element.innerHTML = 'Page not found';
        }
    }

    const retrievedUserString = localStorage.getItem('user');
    if (retrievedUserString) {
        activeUser = JSON.parse(retrievedUserString);
        document.getElementById("userInitials").innerHTML = getInitials(activeUser.name);
    }
    else if (!retrievedUserString && window.location.pathname.includes('legal')) {
        document.querySelector(".nav-link-container").style.display = "none";
    }

    else if (!retrievedUserString && window.location.pathname.includes('privacy')) {
        document.querySelector(".nav-link-container").style.display = "none";
    }
};

/**
 * Saves the active user to local storage.
 */
function saveUser() {
    const userString = JSON.stringify(activeUser);
    localStorage.setItem('user', userString);
};

/**
 * Loads the active user from local storage.
 */
function loadUser() {
    const retrievedUserString = localStorage.getItem('user');
    if (retrievedUserString) {
        activeUser = JSON.parse(retrievedUserString);
    }
    else if (window.location.pathname.includes('/html/') && !window.location.pathname.includes('register') && !window.location.pathname.includes('legal') && !window.location.pathname.includes('privacy')) {
        window.location.href = "../index.html";
    }
};

loadUser();

/**
 * Logs out the active user.
 */
function logout() {
    localStorage.removeItem('user');
    activeUser = "";
    goTologin();
};

/**
 * Activates the guest user mode.
 */
function guestUserActive() {
    activeUser.name = "Guest";
    saveUser(activeUser);
    goToBoard();
};

/**
 * Gets the initials from a name.
 * @param {string} name - The name to get initials from.
 * @returns {string} The initials.
 */
function getInitials(name) {
    const nameParts = name.trim().split(/\s+/);
    const initials = nameParts.map(part => part[0].toUpperCase()).join('');
    return initials;
};

/**
 * Redirects to the board page.
 */
function goToBoard() {
    window.location.href = "./html/summary.html"
};

/**
 * Redirects to the login page.
 */
function goTologin() {
    window.location.href = "../index.html"
};

/**
 * Sets the background for the active page.
 * @param {number} i - The index of the active page.
 */
function setBackground(i) {
    activePage = [
        false,
        false,
        false,
        false,
        false,
        false
    ];
    activePage[i] = true;
    changeBackground(i);
};

/**
 * Changes the background for the active page.
 * @param {number} i - The index of the active page.
 */
function changeBackground(i) {
    if (i <= 3) {
        document.getElementById(`navLink${i}`).style.backgroundColor = "#12223f"
    } else if (i >= 4) {
        document.getElementById(`navLink${i}`).style.color = "#29ABE2"
        document.getElementById(`navLink${i}`).style.fontWeight = "bold"
    }
};
