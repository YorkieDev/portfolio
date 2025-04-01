document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const backToTopButton = document.querySelector('.back-to-top');
    const sections = document.querySelectorAll('.content-section.fade-in');
    const tiltElements = document.querySelectorAll('.tilt-effect');

    // --- Theme Handling --- //
    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
            if (themeToggle) themeToggle.checked = false; // Unchecked = Light
        } else {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
            if (themeToggle) themeToggle.checked = true; // Checked = Dark
        }
    };

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply saved theme or system preference
    applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    // Set initial toggle state based on applied theme
    if (body.classList.contains('dark-theme')) {
        if (themeToggle) themeToggle.checked = true;
    } else {
        if (themeToggle) themeToggle.checked = false;
    }

    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // System theme change listener (optional, updates if no manual preference is set)
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    try {
        darkModeMediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) { // Only if user hasn't manually toggled
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    } catch (err) {
        console.warn('System theme change listener not fully supported.');
    }

    // --- Back to Top Button --- //
    const handleScroll = () => {
        if (window.scrollY > 300) {
            backToTopButton?.classList.add('visible');
        } else {
            backToTopButton?.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Scroll Animations (Fade In) --- //
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    };

    const intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        intersectionObserver.observe(section);
    });

    // --- Tilt Effect (Optional) --- //
    const addTiltEffect = () => {
        if (window.innerWidth < 768) return; // Disable on smaller screens

        tiltElements.forEach(element => {
            let tiltTarget = element; // Tilt the card itself by default
            // If you want to tilt an inner element instead, adjust selector:
            // let tiltTarget = element.querySelector('.tilt-inner');

            if (!tiltTarget) return;

            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element.
                const y = e.clientY - rect.top;  // y position within the element.

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const deltaX = x - centerX;
                const deltaY = y - centerY;

                // Adjust max rotation for desired effect
                const maxRotate = 5; // degrees

                const rotateX = (deltaY / centerY) * -maxRotate; // Invert Y rotation
                const rotateY = (deltaX / centerX) * maxRotate;

                // Apply the transform to the target element
                tiltTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                tiltTarget.style.transition = 'transform 0.05s linear'; // Quick follow
            });

            element.addEventListener('mouseleave', () => {
                tiltTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                tiltTarget.style.transition = 'transform 0.3s ease-out'; // Smooth return
            });
        });
    };

    addTiltEffect(); // Initialize tilt effect
    // Re-initialize or remove on window resize if needed
    // window.addEventListener('resize', addTiltEffect);
}); 