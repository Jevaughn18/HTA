document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            console.log('Mobile menu toggled, aria-expanded:', !isExpanded);
        });
    } else {
        console.warn('Mobile menu toggle or nav menu not found');
    }

    // Departments Dropdown
    const departmentsTab = document.querySelector('.departments-tab');
    const dropdown = document.querySelector('#departmentsModal');

    if (departmentsTab && dropdown) {
        const departmentsLink = departmentsTab.querySelector('a');

        departmentsLink.addEventListener('click', (e) => {
            e.preventDefault();
            const isExpanded = departmentsLink.getAttribute('aria-expanded') === 'true';
            departmentsLink.setAttribute('aria-expanded', !isExpanded);
            dropdown.classList.toggle('active');
            console.log('Departments dropdown toggled, aria-expanded:', !isExpanded);
        });

        departmentsLink.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isExpanded = departmentsLink.getAttribute('aria-expanded') === 'true';
                departmentsLink.setAttribute('aria-expanded', !isExpanded);
                dropdown.classList.toggle('active');
                console.log('Departments dropdown toggled via keyboard, aria-expanded:', !isExpanded);
                if (!isExpanded) {
                    dropdown.querySelector('a').focus();
                }
            }
        });

        document.addEventListener('click', (e) => {
            if (!departmentsTab.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
                departmentsLink.setAttribute('aria-expanded', 'false');
                console.log('Departments dropdown closed');
            }
        });

        dropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                console.log('Navigating to:', link.getAttribute('href'));
                dropdown.classList.remove('active');
                departmentsLink.setAttribute('aria-expanded', 'false');
            });

            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log('Navigating to via keyboard:', link.getAttribute('href'));
                    window.location.href = link.getAttribute('href');
                }
            });
        });
    } else {
        console.warn('Departments tab or dropdown not found');
    }

    // Hero Slideshow (for index.html and events.html)
    const heroSlideshows = document.querySelectorAll('.hero-slideshow');
    heroSlideshows.forEach(slideshow => {
        const slides = slideshow.querySelectorAll('.slide');
        const dotsContainer = slideshow.parentElement.querySelector('.dots');
        let currentSlide = 0;

        if (slides.length > 0 && dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });

            slides[currentSlide].classList.add('active');

            const slideInterval = setInterval(() => {
                goToSlide((currentSlide + 1) % slides.length);
            }, 5000);

            function goToSlide(index) {
                slides.forEach(slide => {
                    slide.classList.remove('active');
                    slide.style.opacity = '0';
                });
                document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
                currentSlide = index;
                slides[currentSlide].classList.add('active');
                slides[currentSlide].style.opacity = '1';
                document.querySelectorAll('.dot')[currentSlide].classList.add('active');
                console.log('Slideshow moved to slide:', index + 1);
            }
        } else {
            console.warn('Slides or dots container not found for hero slideshow');
        }
    });

    // Fade-in Animations
    const aboutContainer = document.querySelector('.about-container');
    const missionContent = document.querySelector('.mission-content');
    const coreContent = document.querySelector('.core-content');
    const youthContainer = document.querySelector('.national-youth-department');
    const mediaSection = document.querySelector('.media');

    function checkScroll() {
        const windowHeight = window.innerHeight;

        if (aboutContainer) {
            const aboutTop = aboutContainer.getBoundingClientRect().top;
            if (aboutTop < windowHeight * 0.8) {
                aboutContainer.classList.add('loaded');
                console.log('About section loaded');
                const aboutImage = aboutContainer.querySelector('.about-image img');
                const aboutTitle = aboutContainer.querySelector('.about-title-card');
                if (aboutImage) aboutImage.style.opacity = '1';
                if (aboutTitle) aboutTitle.style.opacity = '1';
            }
        }

        if (missionContent) {
            const missionTop = missionContent.getBoundingClientRect().top;
            if (missionTop < windowHeight * 0.8) {
                missionContent.parentElement.classList.add('loaded');
                console.log('Mission statement loaded');
            }
        }

        if (coreContent) {
            const coreTop = coreContent.getBoundingClientRect().top;
            if (coreTop < windowHeight * 0.8) {
                coreContent.classList.add('loaded');
                console.log('Core beliefs section loaded');
            }
        }

        if (youthContainer) {
            const youthTop = youthContainer.getBoundingClientRect().top;
            if (youthTop < windowHeight * 0.8) {
                youthContainer.classList.add('loaded');
                console.log('National Youth Department section loaded');
            }
        }

        if (mediaSection) {
            const mediaTop = mediaSection.getBoundingClientRect().top;
            if (mediaTop < windowHeight * 0.8) {
                mediaSection.classList.add('loaded');
                console.log('Media section loaded');
            }
        }
    }

    checkScroll();

    if (missionContent) {
        setTimeout(() => {
            if (!missionContent.parentElement.classList.contains('loaded')) {
                missionContent.parentElement.classList.add('loaded');
                console.log('Fallback: Mission statement loaded after timeout');
            }
        }, 3000);
    }

    if (youthContainer) {
        setTimeout(() => {
            if (!youthContainer.classList.contains('loaded')) {
                youthContainer.classList.add('loaded');
                console.log('Fallback: National Youth Department loaded after timeout');
            }
        }, 3000);
    }

    if (mediaSection) {
        setTimeout(() => {
            if (!mediaSection.classList.contains('loaded')) {
                mediaSection.classList.add('loaded');
                console.log('Fallback: Media section loaded after timeout');
            }
        }, 3000);
    }

    let lastScroll = 0;
    const header = document.querySelector('header.scroll-nav');
    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > lastScroll && currentScroll > 50) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
                if (currentScroll > 50) {
                    header.style.background = '#FFFFFF';
                } else {
                    header.style.background = 'transparent';
                }
            }
            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        });
    }

    window.addEventListener('scroll', checkScroll);

    // Scroll-triggered background for give.html
    const messageSection = document.querySelector('.message-section');
    const giveHero = document.querySelector('.give-hero');

    if (messageSection && giveHero) {
        window.addEventListener('scroll', () => {
            const messageTop = messageSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (messageTop < windowHeight) {
                messageSection.style.background = 'url(construction-site.jpg) no-repeat center center / cover';
            } else {
                giveHero.style.background = 'url(church-building.jpg) no-repeat center center / cover';
            }
        });
    }
});