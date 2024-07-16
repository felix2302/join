/**
 * Renders the HTML for the contact list organized by letter.
 * @param {Object} contactsByLetter - An object with contacts organized by letter.
 */
async function renderContactsListHtml(contactsByLetter) {
    let html = renderNewContactButton();
    for (let [capitalLetter, contacts] of Object.entries(contactsByLetter)) {
        html += renderCapitalLetter(capitalLetter);
        for (let contact of contacts) {
            let renderedContact = await renderContact(contact);
            html += renderedContact;
        }
    }
    contactsList.innerHTML = html;
}

async function renderContactsList() {
    await new Promise(resolve => setTimeout(resolve, 40));
    let contacts = await processContactsData();
    sortContacts(contacts);

    let contactsByLetter = organizeContactsByLetter(contacts);
    await renderContactsListHtml(contactsByLetter);
}

renderContactsList();

/**
 * Displays the detailed view of a single contact.
 */
function showSingleContactView(selectedContact, color, initials, name, email, phone) {
    badgeAndName.style.display = 'flex';
    profileBadge.style.backgroundColor = color;
    profileBadge.textContent = initials;
    contactName.textContent = name;
    contactLink.href = `mailto:${email}`;
    contactLink.textContent = email;
    contactInformation.classList.remove('d-none');
    contactPhone.textContent = phone;
    nameEmailPhoneForEdit = [color, initials, name, email, phone];
    prepareToHighlightContact(selectedContact, email);
}

/**
 * Prepares to highlight the selected contact.
 */
function prepareToHighlightContact(selectedContact, email) {
    if (selectedContact) {
        highlightContact(selectedContact);
    } else {
        findAndHighlightContact(email);
    }
}

/**
 * Highlights the selected contact element.
 */
function highlightContact(selectedContact) {
    removeViewedContactClass();
    selectedContact.classList.add('viewed-contact');
    if (window.innerWidth < 1120) {
        showSingleContactOnly();
    }
}

/**
 * Finds and highlights the contact with the specified email.
 */
function findAndHighlightContact(email) {
    const contactsEmailElements = document.querySelectorAll('.contacts-email');
    let selectedContact = null;

    contactsEmailElements.forEach(element => {
        if (element.textContent.trim() === email) {
            selectedContact = element.closest('.contacts-list-box-entry');
        }
    });

    if (selectedContact) {
        highlightContact(selectedContact);
    }
}

/**
 * Displays the current contact's details in the edit form.
    * Populates the name, email, phone, initials, and color fields.
 */
function displayNameEmailPhoneForEdit() {
    editName.value = nameEmailPhoneForEdit[2] || '';
    editEmail.value = nameEmailPhoneForEdit[3] || '';
    editPhone.value = nameEmailPhoneForEdit[4] || '';
    editBadge.textContent = nameEmailPhoneForEdit[1] || 'G';
    editBadge.style.backgroundColor = nameEmailPhoneForEdit[0] || '#fff';
}

/**
 * Handles the contact edit form submission.
 * Updates the contact details both in the backend and frontend.
 */
async function editContact(event) {
    event.preventDefault();
    let contact = [editEmail.value, editName.value, editPhone.value, editBadge.textContent, editBadge.style.backgroundColor]
    if (editName.value.trim() && editEmail.value.trim() && editPhone.value.trim()) {
        contact[3] = updateInitials(contact);
        let contacts = await loadContactsData();
        await updateMatchingContact(contacts, contact);
        await updateContactFrontend(contact);
    }
}

/**
 * Finds and updates the matching contact in the backend.
 */
async function updateMatchingContact(contacts, contact) {
    for (let key in contacts) {
        if (contacts[key].name === nameEmailPhoneForEdit[2]) {
            await updateContactBackend(key, contact);
            updateInMemoryContactData(contact);
            break;
        }
    }
}

/**
 * Sends a PUT request to update the contact details in the backend.
 */
async function updateContactBackend(key, contact) {
    const url = `${CONTACTS_URL}${key}.json`;
    await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "color": contact[4],
            "email": contact[0],
            "initials": contact[3],
            "name": contact[1],
            "phone": contact[2],
        })
    });
}

/**
 * Closes the edit contact overlay without a transition effect.
 */
function closeOverlayAfterEditWithoutTransition() {
    editContactsOverlayBg.classList.remove('edit-contacts-overlay-bg-transition');
    closeEditContactOverlay();
    setTimeout(() => {
        editContactsOverlayBg.classList.add('edit-contacts-overlay-bg-transition');
    }, 10);
}

/**
 * Updates the contact details in the frontend.
 */
async function updateContactFrontend(contact) {
    contactName.textContent = contact[1];
    contactLink.href = `mailto:${contact[0]}`;
    contactLink.textContent = contact[0];
    contactPhone.textContent = contact[2];
    profileBadge.textContent = contact[3];
    closeOverlayAfterEditWithoutTransition();
    await renderContactsList();
    findAndHighlightContact(contact[0]);
}

/**
 * Updates the in-memory contact data after editing.
 */
function updateInMemoryContactData(contact) {
    nameEmailPhoneForEdit = [
        contact[4], // backgroundColor
        contact[3], // initials
        contact[1], // name
        contact[0], // email
        contact[2]  // phone
    ];
}

/**
 * Updates the initials if the contact's name has changed.
 * @returns {string} - The updated initials.
 */
function updateInitials(contact) {
    if (contact[1] !== nameEmailPhoneForEdit[2]) {
        let initials = getInitials(contact[1]);
        return initials.substring(0, 3);
    } else {
        return contact[3];
    }
}

/**
 * Deletes the contact from the backend.
 */
async function deleteContactBackend() {
    let contacts = await loadContactsData();
    for (let key in contacts) {
        if (contacts[key].name === nameEmailPhoneForEdit[2]) {
            await deleteData(CONTACTS_URL, key);
            break;
        }
    }
    await deleteContactFrontend();
}

/**
 * Deletes the contact from the frontend and updates the UI.
 */
async function deleteContactFrontend() {
    badgeAndName.style.display = 'none';
    contactInformation.classList.add('d-none');
    nameEmailPhoneForEdit = [];
    if (window.innerWidth < 1120) {
        returnToContactsList();
    }
    if (!editContactsOverlayBg.classList.contains('hidden')) {
        closeOverlayAfterEditWithoutTransition();
    }
    await renderContactsList();
}

/**
 * Fetches existing email addresses from the contacts data.
 * 
 * @returns {Array} - The array of existing email addresses.
 */
async function fetchExistingEmails() {
    let contacts = await loadContactsData();
    let emails = [];
    for (let key in contacts) {
        if (contacts[key].email) {
            emails.push(contacts[key].email);
        }
    }
    return emails;
}

let existingEmails = [];

// Adds event listeners to email input fields for validation
document.querySelectorAll('.add-contact-form-email, .edit-contact-form-email').forEach(input => {
    input.addEventListener('focus', async () => {
        existingEmails = await fetchExistingEmails();
    });
    input.addEventListener('input', validateEmail);
});

/**
 * Validates the email input to check if it already exists.
 * 
 * @param {Event} event - The input event.
 */
function validateEmail(event) {
    const emailInput = event.target;
    const email = emailInput.value.trim();
    const emailExists = existingEmails.includes(email);

    if (emailExists) {
        emailInput.setCustomValidity('This email address is already registered.');
    } else {
        emailInput.setCustomValidity('');
    }
}

document.getElementById('add-contact-form').addEventListener('submit', function (event) {
    const emailInput = document.getElementById('add-contact-form-email');
    const emailExists = existingEmails.includes(emailInput.value.trim());

    if (emailExists) {
        event.preventDefault();
        emailInput.setCustomValidity('This email address is already registered.');
    }
});


document.getElementById('edit-contact-form').addEventListener('submit', function (event) {
    const emailInput = document.getElementById('edit-contact-form-email');
    const emailExists = existingEmails.includes(emailInput.value.trim());
    if (emailExists) {
        event.preventDefault();
        emailInput.setCustomValidity('This email address is already registered.');
    }
});

async function fetchFixContacts() {
    for (let fixContact of hardCodedContacts) {
        let color = getRandomContactColor();
        let initials = getInitials(fixContact.name);
        try {
            await postData(CONTACTS_URL, {
                "email": fixContact.email,
                "name": fixContact.name,
                "phone": fixContact.phone,
                "color": color,
                "initials": initials,
                "status": 'normal'
            });
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    }
}
