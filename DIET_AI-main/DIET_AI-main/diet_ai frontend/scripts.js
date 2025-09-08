// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false
        });
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Login Form Validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Get form values
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simple validation
            if (email.trim() === '' || password.trim() === '') {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            // Here you would normally send the data to a server
            // For demo purposes, we'll just show a success message
            showToast('Login successful! Redirecting to dashboard...', 'success');
            
            // Simulate redirect with loading animation
            document.body.classList.add('page-transition');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
    
    // Signup Form Validation
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Get form values
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAgree = document.getElementById('termsAgree').checked;
            
            // Simple validation
            if (fullName.trim() === '' || email.trim() === '' || password.trim() === '') {
                showToast('Please fill in all required fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }
            
            if (!termsAgree) {
                showToast('Please agree to the Terms and Conditions', 'error');
                return;
            }
            
            // Here you would normally send the data to a server
            // For demo purposes, we'll just show a success message
            showToast('Account created successfully! Redirecting to dashboard...', 'success');
            
            // Simulate redirect with loading animation
            document.body.classList.add('page-transition');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
    
    // Diet Plan Form Validation
    const dietPlanForm = document.getElementById('dietPlanForm');
    if (dietPlanForm) {
        dietPlanForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show loading spinner
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...';
            submitBtn.disabled = true;
            
            // Basic validation to ensure required fields are filled
            const requiredFields = dietPlanForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (field.value.trim() === '') {
                    isValid = false;
                    field.classList.add('is-invalid');
                    // Add shake animation to invalid fields
                    field.classList.add('animate__animated', 'animate__shakeX');
                    setTimeout(() => {
                        field.classList.remove('animate__animated', 'animate__shakeX');
                    }, 1000);
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                showToast('Please fill in all required fields', 'error');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                return;
            }
            
            // Simulate processing delay
            setTimeout(() => {
                // Calculate BMI for demonstration purposes
                const weight = parseFloat(document.getElementById('weight').value);
                const height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to m
                const bmi = weight / (height * height);
                
                // Collect form data
                const formData = {
                    name: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    age: document.getElementById('age').value,
                    weight: weight,
                    height: height,
                    gender: document.querySelector('input[name="gender"]:checked').value,
                    activityLevel: document.getElementById('activityLevel').value,
                    goal: document.getElementById('goal').value,
                    dietType: document.querySelector('input[name="dietType"]:checked').value,
                    allergies: document.getElementById('allergies').value,
                    additionalInfo: document.getElementById('additionalInfo').value,
                    bmi: bmi.toFixed(1)
                };
                
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Create a modal to show the result
                const modalHTML = `
                    <div class="modal fade" id="resultModal" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header bg-success text-white">
                                    <h5 class="modal-title">Your Diet Plan is Ready!</h5>
                                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="text-center mb-4">
                                        <div class="checkmark-circle">
                                            <div class="checkmark draw"></div>
                                        </div>
                                    </div>
                                    <p>Thank you, ${formData.name}! We've received your information and prepared your personalized diet plan.</p>
                                    <div class="card mb-3">
                                        <div class="card-body">
                                            <h6>Your Stats:</h6>
                                            <div class="d-flex justify-content-between">
                                                <span>BMI:</span>
                                                <strong>${formData.bmi}</strong>
                                            </div>
                                            <div class="progress mt-1 mb-3" style="height: 5px;">
                                                <div class="progress-bar bg-${getBMICategory(bmi).color}" role="progressbar" style="width: ${Math.min(bmi / 40 * 100, 100)}%" aria-valuenow="${bmi}" aria-valuemin="0" aria-valuemax="40"></div>
                                            </div>
                                            <div class="d-flex justify-content-between">
                                                <span>Category:</span>
                                                <strong class="text-${getBMICategory(bmi).color}">${getBMICategory(bmi).category}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <p>Based on your goal to <strong>${formData.goal.replace('-', ' ')}</strong>, we've created a customized meal plan that fits your ${formData.dietType} diet preferences.</p>
                                    <p>Your complete diet plan has been sent to <strong>${formData.email}</strong>.</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-success download-btn" onclick="downloadDietPlan('${formData.name}', '${formData.goal}', '${formData.dietType}')">
                                        <i class="bi bi-download me-2"></i> Download Diet Plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add the modal to the document
                const modalContainer = document.createElement('div');
                modalContainer.innerHTML = modalHTML;
                document.body.appendChild(modalContainer);
                
                // Show the modal with animation
                let bootstrap = window.bootstrap;
                const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
                resultModal.show();
                
                // Add animation to the checkmark
                setTimeout(() => {
                    const checkmark = document.querySelector('.checkmark-circle');
                    if (checkmark) {
                        checkmark.classList.add('animate');
                    }
                }, 200);
                
                // Reset the form
                dietPlanForm.reset();
            }, 2000); // Simulate 2 second processing time
        });
    }
    
    // Function to determine BMI category
    window.getBMICategory = function(bmi) {
        if (bmi < 18.5) {
            return { category: 'Underweight', color: 'info' };
        } else if (bmi >= 18.5 && bmi < 25) {
            return { category: 'Normal', color: 'success' };
        } else if (bmi >= 25 && bmi < 30) {
            return { category: 'Overweight', color: 'warning' };
        } else {
            return { category: 'Obese', color: 'danger' };
        }
    };
    
    // Function to download diet plan PDF
    window.downloadDietPlan = function(name, goal, dietType) {
        // Show loading toast
        showToast('Preparing your download...', 'info');
        
        // Simulate download delay
        setTimeout(() => {
            // Create a link element
            const link = document.createElement('a');
            
            // Set link properties based on diet type and goal
            let fileName = '';
            
            if (dietType === 'vegetarian') {
                fileName = 'vegetarian';
            } else if (dietType === 'vegan') {
                fileName = 'vegan';
            } else if (dietType === 'keto') {
                fileName = 'keto';
            } else if (dietType === 'paleo') {
                fileName = 'paleo';
            } else {
                fileName = 'regular';
            }
            
            if (goal === 'weight-loss') {
                fileName += '_weight_loss_plan.pdf';
            } else if (goal === 'muscle-gain') {
                fileName += '_muscle_gain_plan.pdf';
            } else {
                fileName += '_maintenance_plan.pdf';
            }
            
            // Set the link to the sample PDF
            link.href = 'sample_diet_plan.pdf';
            link.download = fileName;
            
            // Append to the body
            document.body.appendChild(link);
            
            // Trigger click
            link.click();
            
            // Remove the link
            document.body.removeChild(link);
            
            // Show success toast
            showToast('Download started!', 'success');
        }, 1500);
    };
    
    // Add input event listeners to remove is-invalid class when user types
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Add smooth scroll with animation
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Add highlight animation to the target element
                targetElement.classList.add('highlight-section');
                setTimeout(() => {
                    targetElement.classList.remove('highlight-section');
                }, 1500);
            }
        });
    });
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Add animation to features on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                const animation = element.dataset.animation || 'fadeIn';
                element.classList.add('animate__animated', `animate__${animation}`);
            }
        });
    };
    
    // Call once on load
    animateOnScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Form field validation functions
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return re.test(String(password));
    }
    
    // Add these validation functions to any email or password fields if needed
    const emailFields = document.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.classList.add('is-invalid');
                // Add shake animation
                this.classList.add('animate__animated', 'animate__shakeX');
                setTimeout(() => {
                    this.classList.remove('animate__animated', 'animate__shakeX');
                }, 1000);
            } else {
                this.classList.remove('is-invalid');
            }
        });
    });
    
    // Toast notification system
    function showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Set toast color based on type
        let bgColor = 'bg-info';
        if (type === 'success') bgColor = 'bg-success';
        if (type === 'error') bgColor = 'bg-danger';
        if (type === 'warning') bgColor = 'bg-warning';
        
        // Create toast element
        const toastId = 'toast-' + Date.now();
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white ${bgColor} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        // Add toast to container
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        // Initialize and show toast
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
        toast.show();
        
        // Remove toast after it's hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            toastElement.remove();
        });
    }
    
    // Download sample meal plan buttons
    const downloadButtons = document.querySelectorAll('.download-meal-plan');
    if (downloadButtons) {
        downloadButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const planType = this.dataset.plan;
                
                // Show loading toast
                showToast('Preparing your download...', 'info');
                
                // Simulate download delay
                setTimeout(() => {
                    // Create a link element
                    const link = document.createElement('a');
                    link.href = 'sample_diet_plan.pdf';
                    link.download = `${planType}_meal_plan.pdf`;
                    
                    // Append to the body
                    document.body.appendChild(link);
                    
                    // Trigger click
                    link.click();
                    
                    // Remove the link
                    document.body.removeChild(link);
                    
                    // Show success toast
                    showToast('Download started!', 'success');
                }, 1000);
            });
        });
    }
    
    // Animated counter for stats
    function animateCounter() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    // Run counter animation when elements are in viewport
    const counterSection = document.querySelector('.counter-section');
    if (counterSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counterSection);
    }
    
    // Parallax effect for hero sections
    window.addEventListener('scroll', function() {
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            element.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        });
    });
    
    // Comment: This enhanced script adds animations, interactive elements, and download functionality
    // to the NutriPlan website. It includes smooth scrolling, form validation with visual feedback,
    // toast notifications, animated counters, and PDF download capabilities for diet plans.
});

// Add CSS for toast and animations
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        /* Toast Styling */
        .toast-container {
            z-index: 1060;
        }
        
        /* Checkmark Animation */
        .checkmark-circle {
            width: 80px;
            height: 80px;
            position: relative;
            display: inline-block;
            vertical-align: top;
            margin-left: auto;
            margin-right: auto;
        }
        
        .checkmark-circle .background {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #28a745;
            position: absolute;
        }
        
        .checkmark-circle .checkmark {
            border-radius: 5px;
        }
        
        .checkmark-circle .checkmark.draw:after {
            animation-delay: 100ms;
            animation-duration: 1s;
            animation-timing-function: ease;
            animation-name: checkmark;
            transform: scaleX(-1) rotate(135deg);
            animation-fill-mode: forwards;
        }
        
        .checkmark-circle .checkmark:after {
            opacity: 0;
            height: 40px;
            width: 20px;
            transform-origin: left top;
            border-right: 7px solid #fff;
            border-top: 7px solid #fff;
            border-radius: 2px !important;
            content: '';
            left: 25px;
            top: 45px;
            position: absolute;
        }
        
        @keyframes checkmark {
            0% {
                height: 0;
                width: 0;
                opacity: 0;
            }
            20% {
                height: 0;
                width: 20px;
                opacity: 1;
            }
            40% {
                height: 40px;
                width: 20px;
                opacity: 1;
            }
            100% {
                height: 40px;
                width: 20px;
                opacity: 1;
            }
        }
        
        /* Page Transition */
        .page-transition {
            animation: fadeOut 0.5s ease forwards;
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        /* Highlight Section */
        .highlight-section {
            animation: highlightPulse 1.5s ease;
        }
        
        @keyframes highlightPulse {
            0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
            50% { box-shadow: 0 0 0 20px rgba(40, 167, 69, 0.2); }
            100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }
    `;
    document.head.appendChild(style);
    
    // Add Bootstrap Icons if not already included
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
        const iconLink = document.createElement('link');
        iconLink.rel = 'stylesheet';
        iconLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css';
        document.head.appendChild(iconLink);
    }
    
    // Add Animate.css if not already included
    if (!document.querySelector('link[href*="animate.css"]')) {
        const animateLink = document.createElement('link');
        animateLink.rel = 'stylesheet';
        animateLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
        document.head.appendChild(animateLink);
    }
    
    // Add AOS library if not already included
    if (!document.querySelector('script[src*="aos"]') && !window.AOS) {
        const aosScript = document.createElement('script');
        aosScript.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
        document.body.appendChild(aosScript);
        
        const aosLink = document.createElement('link');
        aosLink.rel = 'stylesheet';
        aosLink.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
        document.head.appendChild(aosLink);
        
        aosScript.onload = function() {
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    easing: 'ease-in-out',
                    once: false
                });
            }
        };
    }

    // Add Bootstrap library if not already included
    if (typeof bootstrap === 'undefined') {
        const bootstrapScript = document.createElement('script');
        bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
        document.body.appendChild(bootstrapScript);
    }
});