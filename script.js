document.addEventListener('DOMContentLoaded', () => {
    // Slideshow Logic (for pages with slideshow, e.g., index.html)
    let slides = document.querySelectorAll('.slide');
    const dots = document.querySelector('.dots');
    let currentSlide = 0;

    if (slides.length > 0 && dots) {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dots.appendChild(dot);
        });

        slides[currentSlide].classList.add('active');

        const slideInterval = setInterval(() => {
            goToSlide((currentSlide + 1) % slides.length);
        }, 5000);
    }

    function goToSlide(index) {
        if (slides.length === 0) return;
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.display = 'none';
        });
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        slides[currentSlide].style.display = 'block';
        setTimeout(() => {
            slides[currentSlide].style.opacity = '1';
        }, 50);
    }

    // Animation Logic for About Us, National Youth Department, Mission, and Core Beliefs
    const aboutContainer = document.querySelector('.about-container');
    const aboutText = document.querySelector('.about-text');
    const youthContainer = document.querySelector('.national-youth-department .about-container');
    const youthText = document.querySelector('.national-youth-department .about-text');
    const missionContent = document.querySelector('.mission-content');
    const coreContent = document.querySelector('.core-content');

    // Trigger animations on load for About Us and National Youth Department
    if (aboutContainer && aboutText) {
        setTimeout(() => {
            aboutContainer.classList.add('loaded');
            aboutText.classList.add('loaded');
        }, 100);
    }
    if (youthContainer && youthText) {
        setTimeout(() => {
            youthContainer.classList.add('loaded');
            youthText.classList.add('loaded');
        }, 100);
    }

    // Trigger animations on scroll for Mission and Core Beliefs
    function checkScroll() {
        const windowHeight = window.innerHeight;

        if (missionContent) {
            const missionTop = missionContent.getBoundingClientRect().top;
            if (missionTop < windowHeight * 0.8) {
                missionContent.classList.add('loaded');
            }
        }

        if (coreContent) {
            const coreTop = coreContent.getBoundingClientRect().top;
            if (coreTop < windowHeight * 0.8) {
                coreContent.classList.add('loaded');
            }
        }
    }

    checkScroll();
    window.addEventListener('scroll', checkScroll);

    // Modal Toggle Logic with Enhanced Persistence
    const departmentsTab = document.querySelector('.departments-tab');
    const modal = document.getElementById('departmentsModal');
    let timeoutId = null;

    if (departmentsTab && modal) {
        const hoverArea = [departmentsTab, modal];

        hoverArea.forEach(element => {
            element.addEventListener('mouseenter', () => {
                clearTimeout(timeoutId); // Clear any existing timeout
                modal.classList.add('active');
            });

            element.addEventListener('mouseleave', () => {
                timeoutId = setTimeout(() => {
                    if (!departmentsTab.matches(':hover') && !modal.matches(':hover')) {
                        modal.classList.remove('active');
                    }
                }, 500); // 500ms delay before hiding
            });
        });

        // Prevent modal from closing when clicking links
        modal.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from triggering outside click handler
            if (event.target.tagName === 'A') {
                // Allow link navigation
                setTimeout(() => modal.classList.remove('active'), 100); // Delay to ensure navigation
            }
        });

        // Ensure modal hides when clicking outside
        document.addEventListener('click', (event) => {
            if (!departmentsTab.contains(event.target) && !modal.contains(event.target)) {
                modal.classList.remove('active');
            }
        });
    }
});