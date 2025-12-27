// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const strengthProgress = document.getElementById('strengthProgress');
    const strengthText = document.getElementById('strengthText');
    const refreshBtn = document.getElementById('refreshJson');
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('registrationForm');
    const notification = document.getElementById('notification');
    
    // Toggle password visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    if (toggleConfirmPasswordBtn && confirmPasswordInput) {
        toggleConfirmPasswordBtn.addEventListener('click', function() {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Password strength checker
    if (passwordInput && strengthProgress && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            
            strengthProgress.style.width = strength.percentage + '%';
            strengthProgress.style.backgroundColor = strength.color;
            strengthText.textContent = strength.text;
            strengthText.style.color = strength.color;
        });
    }
    
    function checkPasswordStrength(password) {
        let score = 0;
        
        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // Character variety checks
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        // Determine strength
        let strength = {
            percentage: 0,
            color: '#e74c3c',
            text: 'Weak'
        };
        
        if (score >= 6) {
            strength.percentage = 100;
            strength.color = '#2ecc71';
            strength.text = 'Strong';
        } else if (score >= 4) {
            strength.percentage = 66;
            strength.color = '#f39c12';
            strength.text = 'Medium';
        } else if (score >= 2) {
            strength.percentage = 33;
            strength.color = '#e74c3c';
            strength.text = 'Weak';
        }
        
        return strength;
    }
    
    // Form validation with real-time feedback
    if (form) {
        form.addEventListener('input', function(e) {
            const input = e.target;
            
            if (input.id === 'name') {
                validateName(input);
            } else if (input.id === 'email') {
                validateEmail(input);
            } else if (input.id === 'password') {
                validatePassword(input);
            } else if (input.id === 'confirm_password') {
                validateConfirmPassword(input);
            }
        });
    }
    
    function validateName(input) {
        const value = input.value.trim();
        if (value.length < 2) {
            setInvalid(input, 'Name must be at least 2 characters');
        } else {
            setValid(input);
        }
    }
    
    function validateEmail(input) {
        const email = input.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailPattern.test(email)) {
            setInvalid(input, 'Please enter a valid email address');
        } else {
            setValid(input);
        }
    }
    
    function validatePassword(input) {
        const password = input.value;
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (!pattern.test(password)) {
            setInvalid(input, 'Password does not meet requirements');
        } else {
            setValid(input);
        }
    }
    
    function validateConfirmPassword(input) {
        const password = document.getElementById('password').value;
        const confirmPassword = input.value;
        
        if (confirmPassword !== password) {
            setInvalid(input, 'Passwords do not match');
        } else {
            setValid(input);
        }
    }
    
    function setValid(input) {
        input.classList.remove('invalid');
        input.classList.add('valid');
    }
    
    function setInvalid(input, message) {
        input.classList.remove('valid');
        input.classList.add('invalid');
        
        // Show error message in tooltip
        const errorSpan = input.parentElement.querySelector('.error');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }
    
    // Form submission with loading animation
    if (form) {
        form.addEventListener('submit', function(e) {
            // Basic validation before submission
            let isValid = true;
            
            // Validate all fields
            validateName(document.getElementById('name'));
            validateEmail(document.getElementById('email'));
            validatePassword(document.getElementById('password'));
            validateConfirmPassword(document.getElementById('confirm_password'));
            
            // Check terms checkbox
            const termsCheckbox = document.getElementById('terms');
            if (!termsCheckbox || !termsCheckbox.checked) {
                showNotification('Please agree to the terms and conditions', 'error');
                isValid = false;
            }
            
            // If valid, show loading animation
            if (isValid) {
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                }
                
                // Simulate API call delay (remove this in production)
                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
                }, 2000);
            } else {
                e.preventDefault();
                showNotification('Please fix the errors in the form', 'error');
            }
        });
    }
    
    // Refresh JSON data
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
        this.classList.add('loading');
        
        fetch('users.json')
            .then(response => response.text())
            .then(data => {
                document.getElementById('jsonOutput').textContent = data;
                
                // Update user count
                try {
                    const users = JSON.parse(data);
                    document.getElementById('userCount').textContent = users.length;
                    document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                }
                
                showNotification('Data refreshed successfully', 'success');
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
                showNotification('Failed to refresh data', 'error');
            })
            .finally(() => {
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 500);
            });
        });
    }
    
    // Initialize user count on page load
    function initializeUserCount() {
        try {
            const jsonOutputEl = document.getElementById('jsonOutput');
            if (!jsonOutputEl) return;
            const jsonOutput = jsonOutputEl.textContent;
            const users = JSON.parse(jsonOutput);
            const userCountEl = document.getElementById('userCount');
            if (userCountEl) userCountEl.textContent = users.length;
        } catch (e) {
            console.error('Error initializing user count:', e);
        }
    }
    
    initializeUserCount();
    
    // Notification system
    function showNotification(message, type = 'success') {
        if (!notification) return;
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
    
    // Add floating animation to form elements on load
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
        group.classList.add('animate-on-load');
    });
    
    // Add ripple effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .animate-on-load {
            animation: fadeInUp 0.5s ease-out forwards;
            opacity: 0;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});