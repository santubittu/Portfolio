// Function to create and append the Preloader
const createPreloader = () => {
     // Prevent creating multiple preloaders
     if (document.querySelector('.preloader')) return;

    const loader = document.createElement('div');
    loader.className = 'preloader';
    loader.innerHTML = '<div class="spinner"></div>';
    // Insert before the first child of body
    if (document.body.firstChild) {
        document.body.insertBefore(loader, document.body.firstChild);
    } else {
        document.body.appendChild(loader); // Fallback if body is empty
    }
    document.body.classList.add('loading'); // Add loading class immediately
};

// Function to create and append the Scroll Top Button
const createScrollTopButton = () => {
    // Prevent creating multiple buttons
    if (document.querySelector('.scroll-top-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    // Use fa-fw for fixed width icon, aria-hidden for accessibility
    btn.innerHTML = '<i class="fas fa-arrow-up fa-fw" aria-hidden="true"></i>';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.setAttribute('title', 'Scroll to top'); // Tooltip for hover
    document.body.appendChild(btn);
};

// --- Create dynamic elements immediately ---
createPreloader();
createScrollTopButton();

// --- Wait for DOM content to be fully loaded for other initializations ---
document.addEventListener('DOMContentLoaded', () => {

    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        once: true,
        offset: 120, // Trigger animations slightly later
        // disable: 'mobile' // Consider enabling if animations are laggy on mobile
    });

    // Typed.js initialization
    const typedElement = document.querySelector('.typed-text');
    if (typedElement) {
        try {
            const typed = new Typed('.typed-text', {
                strings: [
                    'Professional Accountant',
                    'Financial Expert',
                    'GST Specialist',
                    'Web Developer',
                    'Data Analyst',
                    'Digital Marketing Enthusiast'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true,
                smartBackspace: true
            });
        } catch (error) {
            console.error("Typed.js initialization failed:", error);
            // Fallback or hide element if Typed.js fails
            typedElement.textContent = 'Professional Accountant'; // Example fallback
        }
    } else {
        console.warn("Element with class '.typed-text' not found for Typed.js.");
    }

    // Navbar scroll effect and Scroll Padding adjustment
    const navbar = document.querySelector('.navbar.fixed-top'); // Be more specific
    if (navbar) {
        const setScrollPadding = () => {
            const navbarHeight = navbar.offsetHeight;
            document.documentElement.style.scrollPaddingTop = `${navbarHeight}px`;
        };

        setScrollPadding(); // Set initially
        // Update on window resize and orientation change
        window.addEventListener('resize', setScrollPadding);
        window.addEventListener('orientationchange', setScrollPadding);

        // Navbar background change on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    } else {
        console.warn("Navbar element not found.");
    }

    // Smooth scrolling & Active Nav Link Highlighting
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    // Function to update active nav link based on scroll position
    const updateActiveNavLink = () => {
        if (!sections.length || !navLinks.length || !navbar) return; // Exit if essential elements are missing

        let currentSectionId = '';
        const scrollY = window.scrollY;
        const navbarHeight = navbar.offsetHeight;
        const pageBottomReached = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 30; // 30px buffer

        if (pageBottomReached) {
            // If at the bottom, activate the last section link
             const lastSection = sections[sections.length - 1];
             if (lastSection) currentSectionId = lastSection.id;
        } else {
            // Otherwise, find the current section
            sections.forEach(section => {
                const sectionTop = section.offsetTop - navbarHeight - 60; // Adjust buffer as needed
                if (scrollY >= sectionTop) {
                    currentSectionId = section.id;
                }
            });
        }

         // Handle the very top of the page before the first section
        if (!currentSectionId && sections.length > 0 && scrollY < (sections[0].offsetTop - navbarHeight - 60)) {
             currentSectionId = sections[0].id; // Default to first section if above it
             // Or default to 'home' if the first section isn't the target of the first link
             if (navLinks[0].getAttribute('href') === '#home') currentSectionId = 'home';
        }


        // Update 'active' class on links
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href matches the current section ID
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };


    if (navLinks.length > 0 && sections.length > 0) {
        // Smooth scroll on click
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement && navbar) {
                    const navbarHeight = navbar.offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - navbarHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Manually update active class on click (optional, scroll listener also does it)
                    // navLinks.forEach(link => link.classList.remove('active'));
                    // this.classList.add('active');

                    // Close mobile navbar if open
                    const navbarCollapse = document.querySelector('.navbar-collapse.show');
                    if (navbarCollapse) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
                        bsCollapse.hide();
                    }
                } else {
                    console.warn(`Target element "${targetId}" or navbar not found for smooth scroll.`);
                }
            });
        });

        // Debounced scroll listener for active link highlighting
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateActiveNavLink, 100); // Check less often
        }, { passive: true });

        updateActiveNavLink(); // Initial check
    }


    // Form submission handling (Using Bootstrap's validation feedback)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            if (!this.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // Form is valid, handle submission via JS
                event.preventDefault();

                const name = this.querySelector('#contactName')?.value ?? ''; // Use optional chaining and nullish coalescing
                const email = this.querySelector('#contactEmail')?.value ?? '';
                const subject = this.querySelector('#contactSubject')?.value ?? '';
                const message = this.querySelector('#contactMessage')?.value ?? '';

                // --- Replace with your actual form submission logic ---
                console.log('Form Data:', { name, email, subject, message });
                alert('Thank you for your message! I will get back to you soon.');
                // Example: Use fetch to send data to a server or service like Formspree
                // fetch('YOUR_ENDPOINT_HERE', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ name, email, subject, message })
                // })
                // .then(response => response.ok ? alert('Success!') : alert('Error sending message.'))
                // .catch(error => { console.error('Form submission error:', error); alert('Error sending message.'); });
                // --- End of example submission logic ---

                this.reset(); // Reset form fields
                this.classList.remove('was-validated'); // Remove validation classes
            }

            // Always add 'was-validated' after the check to show feedback
            this.classList.add('was-validated');
        });
    } else {
        console.warn("Contact form element not found.");
    }

    // Progress bar animation on scroll
    const languageProgressBars = document.querySelectorAll('.language-skill .progress-bar');
    if (languageProgressBars.length > 0) {
        const animateLanguageProgress = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const value = progressBar.getAttribute('data-width');
                    if (value) { // Check if data-width attribute exists
                        progressBar.style.width = value;
                    } else {
                        console.warn("Progress bar missing data-width attribute:", progressBar);
                    }
                    observer.unobserve(progressBar);
                }
            });
        };

        const languageObserver = new IntersectionObserver(animateLanguageProgress, {
             root: null,
             threshold: 0.5 // Trigger when 50% is visible
        });

        languageProgressBars.forEach(bar => {
            bar.style.width = '0%'; // Initialize width
            languageObserver.observe(bar);
        });
    } else {
         console.warn("No language progress bars found.");
    }

    // Card hover effect (CSS handles this, JS listeners removed for simplicity)

    // Custom cursor initialization
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        const speed = 0.1;
        let animationFrameId = null;

        const updateCursorPosition = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

        if (!isTouchDevice) {
            document.addEventListener('mousemove', updateCursorPosition, { passive: true });

            const animateCursor = () => {
                const dx = mouseX - cursorX;
                const dy = mouseY - cursorY;

                // Only update if movement is significant enough
                if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                    cursorX += dx * speed;
                    cursorY += dy * speed;
                    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
                }
                animationFrameId = requestAnimationFrame(animateCursor);
            };
            animateCursor(); // Start loop

            // Add hover effect listeners for interactive elements
            document.querySelectorAll('a, button, .timeline-icon, .skill-tag, .accordion-button, input, textarea, select, label, [data-bs-toggle]')
                .forEach(el => {
                    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
                    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
                    el.addEventListener('focus', () => cursor.classList.add('hover'));
                    el.addEventListener('blur', () => cursor.classList.remove('hover'));
                });

        } else {
            cursor.style.display = 'none'; // Hide cursor on touch devices
        }
    } else {
        console.warn("Custom cursor element not found.");
    }

    // Preloader fade-out logic
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        const hidePreloader = () => {
            if (!preloader) return; // Check again in case it was removed already
            preloader.style.opacity = '0';
            preloader.addEventListener('transitionend', () => {
                if (preloader.parentNode) {
                    preloader.remove();
                }
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
            }, { once: true });
            // Ensure removal even if transitionend doesn't fire (e.g., display: none)
             setTimeout(() => {
                if (preloader && preloader.parentNode) preloader.remove();
                 document.body.classList.remove('loading');
                 document.body.classList.add('loaded');
            }, 600); // Slightly longer than transition
        };

        window.addEventListener('load', () => {
            setTimeout(hidePreloader, 300); // Hide after a short delay on load
        });

        // Fallback timeout in case 'load' event is excessively delayed
        setTimeout(() => {
             if (document.body.classList.contains('loading')) { // Only hide if still loading
                 console.warn("Load event timeout reached, forcing preloader hide.");
                 hidePreloader();
             }
        }, 4000); // Increased fallback timeout

    } else {
        // If no preloader element, ensure loading class is removed
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        console.warn("Preloader element not found.");
    }

    // Scroll-to-top button functionality
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (scrollTopBtn) {
        let isVisible = false;
        const scrollThreshold = 400; // Pixels from top to show button

        const checkScrollTopButton = () => {
            if (window.scrollY > scrollThreshold && !isVisible) {
                scrollTopBtn.classList.add('show');
                isVisible = true;
            } else if (window.scrollY <= scrollThreshold && isVisible) {
                scrollTopBtn.classList.remove('show');
                isVisible = false;
            }
        };

        window.addEventListener('scroll', checkScrollTopButton, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        checkScrollTopButton(); // Initial check
    } else {
        console.warn("Scroll-to-top button element not found.");
    }

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Element with ID 'currentYear' not found in footer.");
    }

}); // End DOMContentLoaded