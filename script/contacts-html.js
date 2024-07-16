/**
 * Renders the "Add new contact" button.
 * @returns {string} HTML string for the "Add new contact" button.
 */
function renderNewContactButton() {
    return /*html*/ `
        <button class="add-new-contact-button" onclick="openAddContactOverlay();">
            <span>Add new contact</span>
            <img class="" src="../assets/icons/add-person.svg" alt="">
        </button>
        <img class="add-person-icon bg-darkblue" id="add-person-icon" onclick="openAddContactOverlay()" src="../assets/icons/add-person.svg" alt="">
    `;
}

/**
 * Renders a capital letter header for the contact list.
 * @param {string} capitalLetter - The capital letter to display.
 * @returns {string} HTML string for the capital letter header.
 */
function renderCapitalLetter(capitalLetter) {
    return /*html*/ `
        <div class="contacts-list-box">
            <h3>${capitalLetter}</h3>
        </div>
        <div class="contacts-line"></div>
    `;
};

/**
 * Renders a single contact entry in the contact list.
 * @param {Object} contact - The contact object containing details like color, initials, name, email, and phone.
 * @returns {string} HTML string for the contact entry.
 */
function renderContact(contact) {
    return /*html*/ `
        <div class="contacts-list-box contacts-list-box-entry" onclick="showSingleContactView(this, '${contact.color}', '${contact.initials}', '${contact.name}', '${contact.email}', '${contact.phone}')">
            <div class="contacts-profile-badge flex-center" style="background-color: ${contact.color};">${contact.initials}</div>
            <div class="contacts-list-name-and-email">
                <p>${contact.name}</p>
                <div class="contacts-email color-lightblue">${contact.email}</div>
            </div>
        </div>                
    `;
};