document.addEventListener('DOMContentLoaded', () => {
    const logoBackgroundContainer = document.getElementById('login-start-animation-bg');

    /**
     * Adds the 'd-none' class and sets zIndex to -1 when the colorFade animation ends.
     * @param {AnimationEvent} event - The animation event.
     */
    const addDNoneClass = (event) => {
        if (event.animationName === 'colorFade') {
            logoBackgroundContainer.classList.add('d-none');
            logoBackgroundContainer.style.zIndex = '-1';
        }
    };
});

/**
 * Initializes the login process by temporarily hiding the vertical scrollbar of the login body.
 * The scrollbar will be hidden for 900 milliseconds.
 */
function initLogin() {
    document.getElementById("loginBody").style.overflowY = 'hidden';
    setTimeout(() => {
        document.getElementById("loginBody").style.overflowY = '';
    }, 900);
}


/**
 * Changes the source of the login animation logo image.
 */
function changeImageSource() {
    if (window.location.pathname === "/index.html") {
        document.getElementById('login-animation-logo-white').src = '../assets/img/logo.png';
    }
}
setTimeout(changeImageSource, 700);

/**
 * Handles the login process by validating user credentials and redirecting upon success.
 */
async function login() {
    users = await loadData(USERS_URL);
    let email = document.getElementById("login-input-email");
    let password = document.getElementById("login-input-password");
    activeUser = users.find(user => user.email === email.value);

    if (!activeUser) {
        userError();
    } else if (activeUser.password === password.value) {
        activeUser = users.find(u => u.email === email.value && u.password === password.value);
        delete activeUser.password;
        saveUser(activeUser);
        window.location.href = "./html/summary.html";
    } else {
        passwordError();
    }
};

/**
 * Toggles the visibility of the password field.
 */
function toggleVisibility() {
    const passwordField = document.getElementById('login-input-password');
    const toggleImg = document.getElementById('login-visibility-toggle-img');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleImg.src = './assets/icons/visibility.svg';
    } else {
        passwordField.type = 'password';
        toggleImg.src = './assets/icons/visibility_off.svg';
    }
};

/**
 * Displays a user error message when the user is not found.
 */
function userError() {
    document.getElementById('login-input-user-error').classList.remove('d-none');
    document.getElementById('login-input-email').classList.add('login-error-border');
};

/**
 * Removes the user error message.
 */
function removeUserError() {
    document.getElementById('login-input-user-error').classList.add('d-none');
    document.getElementById('login-input-email').classList.remove('login-error-border');
};

/**
 * Displays a password error message when the password is incorrect.
 */
function passwordError() {
    document.getElementById('login-input-password-error').classList.remove('d-none');
    document.getElementById('login-input-password').classList.add('login-error-border');
};

/**
 * Removes the password error message.
 */
function removePasswordError() {
    document.getElementById('login-input-password-error').classList.add('d-none');
    document.getElementById('login-input-password').classList.remove('login-error-border');
};
