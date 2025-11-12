// Harvest Temple Apostolic - Main JavaScript
// Legacy Hills Church Design Implementation

document.addEventListener('DOMContentLoaded', () => {
    // ===================================
    // NAVIGATION SCROLL EFFECT
    // ===================================
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when user scrolls down
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ===================================
    // MOBILE MENU TOGGLE
    // ===================================
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (!isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ===================================
    // VIDEO BACKGROUND FALLBACK
    // ===================================
    const heroVideo = document.querySelector('.hero-video-bg');
    if (heroVideo) {
        // Fallback to image if video fails to load
        heroVideo.addEventListener('error', () => {
            const heroSection = document.querySelector('.hero-video');
            if (heroSection) {
                heroSection.style.backgroundImage = 'url("bankspraise.jpg")';
                heroSection.style.backgroundSize = 'cover';
                heroSection.style.backgroundPosition = 'center';
                heroVideo.style.display = 'none';
            }
        });

        // Ensure video plays on mobile devices
        heroVideo.play().catch(err => {
            console.log('Video autoplay failed:', err);
        });
    }

    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animations
    const animatedElements = document.querySelectorAll('.service-details, .our-vision, .next-steps, .upcoming-events, .generosity-section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // ===================================
    // LAZY LOADING IMAGES
    // ===================================
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports lazy loading
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ===================================
    // PERFORMANCE: Reduce motion for users who prefer it
    // ===================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        // Disable smooth scroll and animations
        document.querySelectorAll('*').forEach(el => {
            el.style.transition = 'none';
            el.style.animation = 'none';
        });
    }

    // ===================================
    // CARD HOVER EFFECTS
    // ===================================
    const cards = document.querySelectorAll('.next-step-card, .event-card, .info-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s ease';
        });
    });

    // ===================================
    // ACCORDION (What We Believe)
    // ===================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');

            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });

    // ===================================
    // VISION GALLERY CAROUSEL
    // ===================================
    const carousel = document.getElementById('visionCarousel');
    
    if (carousel) {
        const container = carousel.querySelector('.gallery-container');
        const items = carousel.querySelectorAll('.gallery-item');
        
        if (container && items.length > 0) {
            let currentIndex = 0;
            let isAutoPlaying = true;
            let autoPlayInterval;
            let isDragging = false;
            let startPos = 0;
            let currentTranslate = 0;
            let prevTranslate = 0;
            
            const itemWidth = 300 + 24; // item width + margin (1.5rem = 24px)
            const totalItems = 4; // Original items count (excluding duplicates)
            const autoPlaySpeed = 3000; // 3 seconds
            
            // Set carousel position
            function setSliderPosition() {
                container.style.transform = `translateX(${currentTranslate}px)`;
            }
            
            // Update position by index
            function setPositionByIndex() {
                currentTranslate = currentIndex * -itemWidth;
                prevTranslate = currentTranslate;
                setSliderPosition();
            }
            
            // Auto-play function
            function autoPlay() {
                if (!isAutoPlaying || isDragging) return;
                
                currentIndex++;
                
                // Smooth transition to next slide
                container.style.transition = 'transform 0.3s ease';
                
                // Check if we've reached the end (duplicated items)
                if (currentIndex >= totalItems) {
                    setPositionByIndex();
                    
                    // After transition, jump back to start without animation
                    setTimeout(() => {
                        container.style.transition = 'none';
                        currentIndex = 0;
                        setPositionByIndex();
                        
                        // Re-enable transition
                        setTimeout(() => {
                            container.style.transition = 'transform 0.5s ease';
                        }, 50);
                    }, 550);
                } else {
                    setPositionByIndex();
                }
            }
            
            // Start auto-play
            function startAutoPlay() {
                stopAutoPlay();
                autoPlayInterval = setInterval(autoPlay, autoPlaySpeed);
            }
            
            // Stop auto-play
            function stopAutoPlay() {
                if (autoPlayInterval) {
                    clearInterval(autoPlayInterval);
                }
            }
            
            // Get position from event
            function getPositionX(event) {
                return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            }
            
            // Touch/Mouse Start
            function handleStart(event) {
                isDragging = true;
                startPos = getPositionX(event);
                prevTranslate = currentTranslate;
                container.style.transition = 'none';
                stopAutoPlay();
            }
            
            // Touch/Mouse Move
            function handleMove(event) {
                if (!isDragging) return;
                
                const currentPosition = getPositionX(event);
                const diff = currentPosition - startPos;
                currentTranslate = prevTranslate + diff;
                setSliderPosition();
            }
            
            // Touch/Mouse End
            function handleEnd() {
                if (!isDragging) return;
                
                isDragging = false;
                const movedBy = currentTranslate - prevTranslate;
                
                // Determine if we should move to next/prev slide
                if (movedBy < -50 && currentIndex < totalItems - 1) {
                    currentIndex++;
                } else if (movedBy > 50 && currentIndex > 0) {
                    currentIndex--;
                }
                
                // Handle wrapping
                if (currentIndex >= totalItems) {
                    currentIndex = 0;
                } else if (currentIndex < 0) {
                    currentIndex = totalItems - 1;
                }
                
                container.style.transition = 'transform 0.5s ease';
                setPositionByIndex();
                
                // Restart auto-play if it was active
                if (isAutoPlaying) {
                    setTimeout(() => {
                        startAutoPlay();
                    }, 500);
                }
            }
            
            // Mouse Events
            carousel.addEventListener('mousedown', handleStart);
            carousel.addEventListener('mousemove', handleMove);
            carousel.addEventListener('mouseup', handleEnd);
            carousel.addEventListener('mouseleave', () => {
                if (isDragging) {
                    handleEnd();
                }
            });
            
            // Touch Events
            carousel.addEventListener('touchstart', handleStart, { passive: true });
            carousel.addEventListener('touchmove', handleMove, { passive: true });
            carousel.addEventListener('touchend', handleEnd);
            
            // Pause on hover (desktop only)
            carousel.addEventListener('mouseenter', () => {
                isAutoPlaying = false;
                stopAutoPlay();
            });
            
            carousel.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    isAutoPlaying = true;
                    startAutoPlay();
                }
            });
            
            // Prevent default dragging behavior
            carousel.addEventListener('dragstart', (e) => e.preventDefault());
            
            // Initialize
            container.style.transition = 'transform 0.5s ease';
            setPositionByIndex();
            startAutoPlay();
        }
    }

    // ===================================
    // LOG INITIALIZATION
    // ===================================
    console.log('Harvest Temple Apostolic website initialized');
    console.log('Design based on Legacy Hills Church');
});