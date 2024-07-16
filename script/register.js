async function register(event) {
    event.preventDefault();
    checkPassword(event);
};

async function addUser() {
    let user = {};
    let email = document.getElementById("register-input-email");
    let password = document.getElementById("register-input-password");
    let name = document.getElementById("register-input-name");
    user.name = name.value;
    user.email = email.value;
    user.password = password.value;
    await postData(USERS_URL, user)
};

function showOverlay() {
    document.getElementById('register-success-overlay').style.display = 'block';
    let successMessage = document.getElementById('register-success-message');
    successMessage.classList.add('show');
    setTimeout(function () {
        successMessage.classList.remove('show');
        document.getElementById('register-success-overlay').style.display = 'none';
    }, 1000);
    setTimeout(function () { window.location.href = "../index.html" }, 1000);
};

async function checkPassword(event) {
    users = await loadData(USERS_URL);
    let email = document.getElementById('register-input-email');
    let password = document.getElementById("register-input-password");
    let passwordConfirm = document.getElementById("register-input-confirm-password");
    let doubleUser = users.find(u => u.email === email.value);
    if (password.value == passwordConfirm.value && !doubleUser) {
        showOverlay();
        addUser();
        registerNewUser(event);
    }
    else if (password.value !== passwordConfirm.value && doubleUser) {
        confirmPasswordError();
        doubleUserError()
    }
    else if (password.value !== passwordConfirm.value) {
        confirmPasswordError()
    }
    else if (doubleUser) {
        doubleUserError()
    }
};

function doubleUserError() {
    document.getElementById('register-input-email').classList.add('register-error-border');
    document.getElementById('register-input-email-error').classList.remove('d-none');
};

function removeDoubleUserError() {
    document.getElementById('register-input-email').classList.remove('register-error-border');
    document.getElementById('register-input-email-error').classList.add('d-none');
};

function confirmPasswordError() {
    document.getElementById('register-input-confirm-password').classList.add('register-error-border');
    document.getElementById('register-input-password-error').classList.remove('d-none');
};

function removeConfirmPasswordError() {
    document.getElementById('register-input-confirm-password').classList.remove('register-error-border');
    document.getElementById('register-input-password-error').classList.add('d-none');
};