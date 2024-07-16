let colorValues = backgroundColors.map(bg => bg.replace("background: ", ""));

/**
 * Gets a random color for the contact from the predefined color values.
 * 
 * @returns {string} - A random color value.
 */
function getRandomContactColor() {
    let colorIndex = Math.floor(Math.random() * colorValues.length);
    return colorValues[colorIndex];
}

/**
 * Handles the registration form submission.
 * Adds a new user to the contacts list upon registration.
 * 
 * @param { Event } event - The form submission event.
 */
async function registerNewUser(event) {
    event.preventDefault();
    let email = document.getElementById("register-input-email");
    let name = document.getElementById("register-input-name");
    let color = getRandomContactColor();
    let initials = getInitials(name.value);
    initials = initials.substring(0, 3);
    await addNewUserToContactsBackend(name, email, color, initials);
}

/**
 * Adds the new user's contact details to the backend.
 * 
 * @param {HTMLElement} name - The name input element.
 * @param {HTMLElement} email - The email input element.
 * @param {string} color - The contact's background color.
 * @param {string} initials - The contact's initials.
 */
async function addNewUserToContactsBackend(name, email, color, initials) {
    if (email.value.trim() && name.value.trim()) {
        let newContact = {
            "email": email.value,
            "name": name.value,
            "phone": '',
            "color": color,
            "initials": initials,
        };
        await postData(CONTACTS_URL, newContact);
    }
}