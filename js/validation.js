document.addEventListener('DOMContentLoaded', function () {
    const regForm = document.forms.regForm;

    const usernameField = regForm.username;
    const emailField = regForm.email;
    const phoneField = regForm.phone;
    const passwordField = regForm.password;
    const confirmPasswordField = regForm.confirm_password;
    const togglePassword = document.getElementById('toggle-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');

    // Validate username field
    usernameField.addEventListener("input", () => {
        validateUsername();
    });

    // Validate email field
    emailField.addEventListener("input", () => {
        validateEmail();
    });

    // Validate password fields
    passwordField.addEventListener("input", () => {
        validatePassword();
        validateConfirmPassword();
    });

    confirmPasswordField.addEventListener("input", () => {
        validateConfirmPassword();
    });

    // Phone number input mask
    phoneField.addEventListener('keydown', function (event) {
        if (!(event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Backspace' || event.key === 'Tab')) {
            event.preventDefault();
        }
        const mask = '+380 (11) 111-11-11'; 
        if (/[0-9+\ -()]/.test(event.key)) {    
            let currentString = this.value;
            let currentLength = currentString.length;
            if (/[0-9]/.test(event.key)) {
                if (mask[currentLength] === '1') {
                    this.value = currentString + event.key;
                } else {
                    for (let i = currentLength; i < mask.length; i++) {
                        if (mask[i] === '1') {
                            this.value = currentString + event.key;
                            break;
                        }
                        currentString += mask[i];
                    }
                }
            }
        } 
    });

    function validateUsername() {
        const userLengthError = document.querySelector('.user-length-error');
        const alphabetError = document.querySelector('.user-alphabet-error');

        if (usernameField.value.length > 3) {
            userLengthError.style.display = 'none';
        } else {
            userLengthError.style.display = 'block';
        }

        if (/^[a-zA-Z.]+$/.test(usernameField.value)) {
            alphabetError.style.display = 'none';
        } else {
            alphabetError.style.display = 'block';
        }
    }

    function validateEmail() {
        const checkValidEmail = emailField.value.split('@');
        const mailAlphabetError = document.querySelector('.mail-alphabet-error');

        if (/^[a-z0-9.]+$/.test(checkValidEmail[0])) {
            mailAlphabetError.style.display = 'none';
        } else {
            mailAlphabetError.style.display = 'block';
        }

        const dogValidError = document.querySelector('.dog-error');
        if (emailField.value.includes("@")) {
            const mailValidError = document.querySelector('.incorrect-mail');
            if (checkValidEmail[1].length >= 7) {
                if (checkValidEmail[1] === 'gmail.com' || checkValidEmail[1] === 'ukr.net') {
                    mailValidError.style.display = 'none';
                } else {
                    mailValidError.style.display = 'block';
                }
                dogValidError.style.display = 'none';
            }
        } else {
            dogValidError.style.display = 'block';
        }
    }

    function validatePassword() {
        const passwordLengthError = document.querySelector('.password-length-error');
        const passwordDigitError = document.querySelector('.password-digit-error');
        const passwordUppercaseError = document.querySelector('.password-uppercase-error');
        const passwordLowercaseError = document.querySelector('.password-lowercase-error');
        const passwordPunctuationError = document.querySelector('.password-punctuation-error');

        const password = passwordField.value;

        if (password.length >= 8) {
            passwordLengthError.style.display = 'none';
        } else {
            passwordLengthError.style.display = 'block';
        }

        if (/\d/.test(password)) {
            passwordDigitError.style.display = 'none';
        } else {
            passwordDigitError.style.display = 'block';
        }

        if (/[A-Z]/.test(password)) {
            passwordUppercaseError.style.display = 'none';
        } else {
            passwordUppercaseError.style.display = 'block';
        }

        if (/[a-z]/.test(password)) {
            passwordLowercaseError.style.display = 'none';
        } else {
            passwordLowercaseError.style.display = 'block';
        }

        if (/[.,?\/#!$%\^&\*;:{}=\-_`~()]/.test(password)) {
            passwordPunctuationError.style.display = 'none';
        } else {
            passwordPunctuationError.style.display = 'block';
        }
    }

    function validateConfirmPassword() {
        const confirmPasswordError = document.querySelector('#confirm-password-error');
        if (passwordField.value === confirmPasswordField.value) {
            confirmPasswordError.style.display = 'none';
        } else {
            confirmPasswordError.style.display = 'block';
        }
    }

    function togglePasswordVisibility(input, eyeIcon) {
        eyeIcon.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.name = 'lock-open-outline'; // Change icon to show open lock
            } else {
                input.type = 'password';
                eyeIcon.name = 'lock-closed-outline'; // Change icon back to closed lock
            }
        });
    }

    togglePasswordVisibility(passwordField, togglePassword);
    togglePasswordVisibility(confirmPasswordField, toggleConfirmPassword);
});
