let contactsList = document.getElementById('contacts-list');
let contactsContainer = document.getElementById('contacts-container');

let contactContainer = document.getElementById('single-contact-container');
let windowBg = document.getElementById('window-bg');
let editContactsOverlayBg = document.getElementById('edit-contacts-overlay-bg');
let addContactsOverlayBg = document.getElementById('add-contacts-overlay-bg');
let editContactOverlay = document.getElementById('overlay-edit-contact');
let addContactOverlay = document.getElementById('overlay-add-contact');

let contactCreatedPopupBg = document.getElementById('contact-created-popup-bg');
let editDeletePopup = document.getElementById('edit-delete-popup');
let singleContactTripleDots = document.getElementById('single-contact-triple-dots');
let addPersonIcon = document.getElementById('add-person-icon');

let nameEmailPhoneForEdit = [];

let editName = document.getElementById('edit-contact-form-name');
let editEmail = document.getElementById('edit-contact-form-email');
let editPhone = document.getElementById('edit-contact-form-phone');
let editBadge = document.getElementById('edit-contact-profile-badge');

let addContactFormName = document.getElementById('add-contact-form-name');
let addContactFormEmail = document.getElementById('add-contact-form-email');
let addContactFormPhone = document.getElementById('add-contact-form-phone');

const badgeAndName = document.querySelector('.single-contact-badge-and-name');
const profileBadge = document.querySelector('.single-contact-profile-badge');
const contactName = document.querySelector('.single-contact-name');
const contactLink = document.querySelector('.single-contact-link');
const contactInformation = document.querySelector('.single-contact-information');
const contactPhone = document.querySelector('.single-contact-phone');

async function initContacts() {
    await includeHTML();
    setBackground(3);
}

function openEditContactOverlay() {
    windowBg.classList.remove('d-none');
    setTimeout(() => {
        windowBg.classList.add('visible');
    }, 10);
    editContactsOverlayBg.classList.remove('hide-edit-contact-overlay');
    if (window.innerWidth < 800) {
        hideEditDeletePopup();
    }
    displayNameEmailPhoneForEdit();
}

function hideEditDeletePopup() {
    editDeletePopup.classList.add('hide-edit-delete-popup');
    singleContactTripleDots.classList.remove('d-none');
    addPersonIcon.classList.remove('d-none');
}

function closeEditContactOverlay() {
    editContactsOverlayBg.classList.add('hide-edit-contact-overlay');
    windowBg.classList.remove('visible');
    setTimeout(() => {
        windowBg.classList.add('d-none');
    }, 300);

}

function closeAddContactOverlay() {
    addContactsOverlayBg.classList.add('hide-add-contact-overlay');
    windowBg.classList.remove('visible');
    setTimeout(() => {
        windowBg.classList.add('d-none');
    }, 300);
    clearInput();
}

function openAddContactOverlay() {
    windowBg.classList.remove('d-none');
    setTimeout(() => {
        windowBg.classList.add('visible');
    }, 10);
    addContactsOverlayBg.classList.remove('hide-add-contact-overlay');
}

function closeContactView() {
    badgeAndName.style.display = 'none';
    contactInformation.classList.add('d-none');
    removeViewedContactClass()
}

function removeViewedContactClass() {
    contactsList.querySelectorAll('.viewed-contact').forEach(element => {
        element.classList.remove('viewed-contact');
    });
}

/**
 * Handles window resize events to adjust the contact view layout.
 */
function handleResize() {
    if (window.innerWidth >= 1120) {
        contactContainer.classList.remove('d-none');
        contactsContainer.classList.remove('d-none');
        contactsContainer.classList.add('d-flex');
    } else if (window.innerWidth < 1120 && badgeAndName.style.display === 'flex') {
        showSingleContactOnly();
    } else if (window.innerWidth < 1120 && badgeAndName.style.display !== 'flex') {
        returnToContactsList();
    }
}

function showSingleContactOnly() {
    contactContainer.classList.remove('d-none');
    contactContainer.classList.add('d-block');
    contactsContainer.classList.remove('d-flex');
    contactsContainer.classList.add('d-none');
}

function returnToContactsList() {
    contactsContainer.classList.add('d-flex');
    contactsContainer.classList.remove('d-none');
    contactContainer.classList.remove('d-block');
    contactContainer.classList.add('d-none');
    closeContactView();
}

window.addEventListener('resize', handleResize);

handleResize();

function displayEditDeletePopup() {
    editDeletePopup.classList.remove('hide-edit-delete-popup');
    setTimeout(function () {
        singleContactTripleDots.classList.add('d-none');
        if (addPersonIcon) {
            addPersonIcon.classList.add('d-none');
        }
    }, 100);
}

/**
 * Prevents the event from propagating and closing the popup.
 * @param {Event} event - The event object.
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * Hides the edit/delete popup on small screens.
 */
function hideEditDeletePopup() {
    if (window.innerWidth < 1200) {
        editDeletePopup.classList.add('hide-edit-delete-popup');
        setTimeout(function () {
            singleContactTripleDots.classList.remove('d-none');
            if (addPersonIcon) {
                addPersonIcon.classList.remove('d-none');
            }
        }, 125);
    }

}

/**
 * Handles the popup for editing or deleting a contact.
 */
function popupDeleteContact() {
    hideEditDeletePopup();
    returnToContactsList();
}

/**
 * Array of color values extracted from background colors.
 * @type { Array < string >}
 */
let colorValues = backgroundColors.map(bg => bg.replace("background: ", ""));

/**
 * Returns a random color value from the colorValues array.
 * @returns {string} A random color value.
 */
function getRandomContactColor() {
    let colorIndex = Math.floor(Math.random() * colorValues.length);
    return colorValues[colorIndex];
}

/**
 * Displays a popup indicating a contact has been created.
 * @param {Event} event - The event object.
 */
function displayContactCreatedPopup(event) {
    event.preventDefault();
    addContactsOverlayBg.classList.remove('add-contacts-overlay-bg-transition');
    closeAddContactOverlay();
    setTimeout(() => {
        addContactsOverlayBg.classList.add('add-contacts-overlay-bg-transition');
    }, 10);
    if (window.innerWidth < 800) {
        hideContactsList();
    }
    contactCreatedPopupBg.classList.remove('hide-contact-created-popup');
    setTimeout(function () {
        contactCreatedPopupBg.classList.add('hide-contact-created-popup');
    }, 800);
}

function hideContactsList() {
    contactsContainer.classList.remove('d-flex');
    contactsContainer.classList.add('d-none');
    contactContainer.classList.remove('d-none');
}

/**
 * Adds a new contact with a random color and initials.
 * @param {Event} event - The event object.
 */
async function addNewContact(event) {
    event.preventDefault();
    let color = getRandomContactColor();
    let initials = getInitials(addContactFormName.value);
    initials = initials.substring(0, 3);
    await addNewContactBackend(color, initials);
}

/**
 * Adds a new contact to the backend.
 * @param {string} color - The color of the contact.
 * @param {string} initials - The initials of the contact.
 */
async function addNewContactBackend(color, initials) {
    if (addContactFormEmail.value.trim() && addContactFormName.value.trim() && addContactFormPhone.value.trim()) {
        let newContact = {
            "email": addContactFormEmail.value,
            "name": addContactFormName.value,
            "phone": addContactFormPhone.value,
            "color": color,
            "initials": initials,
        };
        await postData(CONTACTS_URL, newContact);
        addNewContactFrontend(newContact);
    }
}

/**
 * Adds a new contact to the frontend.
 * @param {Object} newContact - The new contact object.
 */
async function addNewContactFrontend(newContact) {
    await renderContactsList();
    showSingleContactView(null, newContact.color, newContact.initials, newContact.name, newContact.email, newContact.phone);
    clearInput();
}

function clearInput() {
    addContactFormEmail.value = '';
    addContactFormName.value = '';
    addContactFormPhone.value = '';
}

/**
 * Loads contact data from the server.
 * @returns {Promise<Object>} The contact data from the server.
 */
async function loadContactsData() {
    let response = await fetch(CONTACTS_URL + ".json", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: 'no-store'
    });
    let responseAsJson = await response.json();
    return responseAsJson;
}

/**
 * Processes the loaded contact data and returns an array of contacts.
 * @returns {Promise<Array<Object>>} The processed contact data.
 */
async function processContactsData() {
    const data = await loadContactsData();
    let contacts = [];
    for (let key in data) {
        contacts.push({
            name: data[key].name,
            email: data[key].email,
            phone: data[key].phone,
            color: data[key].color,
            initials: data[key].initials,
            id: key,
        });
    }
    return contacts;
}

/**
 * Extracts the first name from a full name string.
 * @param {string} fullName - The full name string.
 * @returns {string} The first name.
 */
function getFirstName(fullName) {
    return fullName.split(' ')[0];
}

/**
 * Extracts the surname from a full name string.
 * @param {string} fullName - The full name string.
 * @returns {string} The surname.
 */
function getSurname(fullName) {
    let surname = fullName.split(' ')[1] || '';
    return surname;
}

/**
 * Sorts an array of contacts by first name and surname.
 * @param {Array<Object>} contacts - The array of contacts to sort.
 */
function sortContacts(contacts) {
    contacts.sort((a, b) => {
        return compareFirstNames(a, b) || compareSurnames(a, b);
    });
}

/**
 * Compares the first names of two contacts.
 * @param {Object} a - The first contact object.
 * @param {Object} b - The second contact object.
 * @returns {number} Comparison result.
 */
function compareFirstNames(a, b) {
    let firstNameA = getFirstName(a.name).toUpperCase();
    let firstNameB = getFirstName(b.name).toUpperCase();

    if (firstNameA < firstNameB) {
        return -1;
    }
    if (firstNameA > firstNameB) {
        return 1;
    }
    return 0;
}

/**
 * Compares the surnames of two contacts.
 * @param {Object} a - The first contact object.
 * @param {Object} b - The second contact object.
 * @returns {number} Comparison result.
 */
function compareSurnames(a, b) {
    let surnameA = getSurname(a.name).toUpperCase();
    let surnameB = getSurname(b.name).toUpperCase();

    if (surnameA < surnameB) {
        return -1;
    }
    if (surnameA > surnameB) {
        return 1;
    }
    return 0;
}

/**
 * Organizes contacts by the first letter of their first name.
 * @param {Array<Object>} contacts - The array of contacts.
 * @returns {Object} An object with contacts organized by letter.
 */
function organizeContactsByLetter(contacts) {
    let contactsByLetter = {};

    contacts.forEach(contact => {
        let firstLetter = getFirstName(contact.name)[0].toUpperCase();
        if (!contactsByLetter[firstLetter]) {
            contactsByLetter[firstLetter] = [];
        }
        contactsByLetter[firstLetter].push(contact);
    });
    return contactsByLetter;
}

