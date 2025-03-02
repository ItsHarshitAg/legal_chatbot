document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const submitButton = registerForm.querySelector('button[type="submit"]');
        
        // Create error message elements
        const nameError = createErrorElement('name-error');
        const emailError = createErrorElement('email-error');
        const passwordError = createErrorElement('password-error');
        const confirmPasswordError = createErrorElement('confirm-password-error');
        
        // Insert error elements after their respective inputs
        nameInput.after(nameError);
        emailInput.after(emailError);
        passwordInput.after(passwordError);
        if (confirmPasswordInput) {
            confirmPasswordInput.after(confirmPasswordError);
        }
        
        // Form validation
        registerForm.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Reset error messages
            hideAllErrors();
            
            // Validate name
            if (!validateName(nameInput.value)) {
                showError(nameError, 'Please enter a valid name (at least 2 characters, letters only)');
                isValid = false;
            }
            
            // Validate email
            if (!validateEmail(emailInput.value)) {
                showError(emailError, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate password
            const passwordValidation = validatePassword(passwordInput.value);
            if (!passwordValidation.isValid) {
                showError(passwordError, passwordValidation.message);
                isValid = false;
            }
            
            // Validate password confirmation if present
            if (confirmPasswordInput && passwordInput.value !== confirmPasswordInput.value) {
                showError(confirmPasswordError, 'Passwords do not match');
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
        
        // Live validation
        nameInput.addEventListener('blur', () => {
            if (nameInput.value && !validateName(nameInput.value)) {
                showError(nameError, 'Please enter a valid name (at least 2 characters, letters only)');
            } else {
                hideError(nameError);
            }
        });
        
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !validateEmail(emailInput.value)) {
                showError(emailError, 'Please enter a valid email address');
            } else {
                hideError(emailError);
            }
        });
        
        passwordInput.addEventListener('input', () => {
            const passwordValidation = validatePassword(passwordInput.value);
            if (passwordInput.value && !passwordValidation.isValid) {
                showError(passwordError, passwordValidation.message);
            } else {
                hideError(passwordError);
            }
            
            // Also check confirmation if it has a value
            if (confirmPasswordInput && confirmPasswordInput.value && 
                passwordInput.value !== confirmPasswordInput.value) {
                showError(confirmPasswordError, 'Passwords do not match');
            } else if (confirmPasswordInput && confirmPasswordInput.value) {
                hideError(confirmPasswordError);
            }
        });
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    showError(confirmPasswordError, 'Passwords do not match');
                } else {
                    hideError(confirmPasswordError);
                }
            });
        }
    }
});

// Helper functions
function validateName(name) {
    return name.trim().length >= 2 && /^[A-Za-z\s]+$/.test(name);
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePassword(password) {
    if (password.length < 8) {
        return {
            isValid: false,
            message: 'Password must be at least 8 characters long'
        };
    }
    
    if (!(/[A-Z]/.test(password))) {
        return {
            isValid: false,
            message: 'Password must contain at least one uppercase letter'
        };
    }
    
    if (!(/[a-z]/.test(password))) {
        return {
            isValid: false,
            message: 'Password must contain at least one lowercase letter'
        };
    }
    
    if (!(/[0-9]/.test(password))) {
        return {
            isValid: false,
            message: 'Password must contain at least one number'
        };
    }
    
    if (!(/[^A-Za-z0-9]/.test(password))) {
        return {
            isValid: false,
            message: 'Password must contain at least one special character'
        };
    }
    
    return {
        isValid: true,
        message: ''
    };
}

function createErrorElement(id) {
    const errorElement = document.createElement('div');
    errorElement.id = id;
    errorElement.className = 'invalid-feedback';
    errorElement.style.display = 'none';
    return errorElement;
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.previousElementSibling.classList.add('is-invalid');
}

function hideError(element) {
    element.style.display = 'none';
    element.previousElementSibling.classList.remove('is-invalid');
}

function hideAllErrors() {
    document.querySelectorAll('.invalid-feedback').forEach(el => {
        el.style.display = 'none';
        if (el.previousElementSibling) {
            el.previousElementSibling.classList.remove('is-invalid');
        }
    });
}
