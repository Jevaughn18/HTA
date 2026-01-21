// ===================================
// HORIZONTAL EVENT CAROUSEL
// Auto-scrolling with manual controls
// ===================================

function initializeEventCarousel() {
    const carousel = document.getElementById('eventCarousel');

    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const items = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    if (!track || items.length === 0) {
        console.log('Event carousel: waiting for content...');
        return;
    }

    // Configuration - Dynamic based on screen size (portrait cards)
    function getItemWidth() {
        const windowWidth = window.innerWidth;
        if (windowWidth <= 480) return 160 + 8; // mobile small (160px + 0.5rem gap)
        if (windowWidth <= 767) return 200 + 8; // mobile medium (200px + 0.5rem gap)
        if (windowWidth <= 912) return 465 + 28; // tablet portrait
        if (windowWidth <= 1200) return 520 + 28; // tablet landscape
        if (windowWidth <= 1400) return 570 + 32; // desktop small
        return 620 + 32; // desktop large (620px portrait card + 2rem gap)
    }

    let itemWidth = getItemWidth();
    let currentIndex = 0; // Track which card we're on

    let currentPosition = 0;
    let isAutoScrolling = true;
    let autoScrollTimer = null;
    let isDragging = false;

    // Count all items
    const originalItemCount = items.length;
    let maxScroll = originalItemCount * itemWidth;

    console.log(`Event Carousel initialized with ${originalItemCount} items, itemWidth: ${itemWidth}px`);

    // Auto-scroll function - moves to next card every 4 seconds
    function autoScroll() {
        if (!isAutoScrolling || isDragging) return;

        // Move to next card (with proper wrapping)
        currentIndex = (currentIndex + 1) % originalItemCount;

        // Apply the scroll
        currentPosition = currentIndex * itemWidth;
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(-${currentPosition}px)`;

        console.log(`Auto-scrolled to card ${currentIndex + 1} of ${originalItemCount}`);
    }

    // Start auto-scrolling - change cards every 4 seconds
    function startAutoScroll() {
        if (autoScrollTimer) return;
        isAutoScrolling = true;
        autoScrollTimer = setInterval(autoScroll, 4000); // 4 seconds between cards
    }

    // Stop auto-scrolling
    function stopAutoScroll() {
        if (autoScrollTimer) {
            clearInterval(autoScrollTimer);
            autoScrollTimer = null;
        }
        isAutoScrolling = false;
    }

    // Manual scroll with buttons
    function scrollBy(direction) {
        stopAutoScroll();

        currentIndex += direction;

        // Handle wrapping
        if (currentIndex < 0) {
            currentIndex = originalItemCount - 1;
        } else if (currentIndex >= originalItemCount) {
            currentIndex = 0;
        }

        currentPosition = currentIndex * itemWidth;
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(-${currentPosition}px)`;

        // Resume auto-scroll after 5 seconds
        setTimeout(() => {
            startAutoScroll();
        }, 5000);
    }

    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => scrollBy(-1));
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => scrollBy(1));
    }

    // Mouse/Touch drag functionality
    let startDragX = 0;
    let startScrollPosition = 0;
    let hasDragged = false;

    function handleDragStart(e) {
        isDragging = true;
        hasDragged = false;
        startDragX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        startScrollPosition = currentPosition;
        track.style.transition = 'none';
        carousel.style.cursor = 'grabbing';
        stopAutoScroll();

        // Prevent text selection during drag
        document.body.style.userSelect = 'none';
    }

    function handleDragMove(e) {
        if (!isDragging) return;

        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const dragDistance = startDragX - x;

        // Only prevent default if there's actual movement
        if (Math.abs(dragDistance) > 5) {
            e.preventDefault();
            hasDragged = true;
        }

        const walk = dragDistance * 1.5; // Multiply for faster drag
        currentPosition = startScrollPosition + walk;

        // Loop around if dragged beyond limits
        if (currentPosition < 0) {
            currentPosition = maxScroll + (currentPosition % maxScroll);
        } else if (currentPosition >= maxScroll) {
            currentPosition = currentPosition % maxScroll;
        }

        track.style.transform = `translateX(-${currentPosition}px)`;
    }

    function handleDragEnd(e) {
        if (!isDragging) return;

        // Prevent click event if user was dragging
        if (hasDragged && e.type === 'mouseup') {
            e.preventDefault();
        }

        isDragging = false;
        carousel.style.cursor = 'grab';
        track.style.transition = 'transform 0.5s ease';
        document.body.style.userSelect = '';

        // Snap to nearest card
        currentIndex = Math.round(currentPosition / itemWidth);
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex >= originalItemCount) currentIndex = originalItemCount - 1;

        currentPosition = currentIndex * itemWidth;
        track.style.transform = `translateX(-${currentPosition}px)`;

        // Resume auto-scroll after 5 seconds
        setTimeout(() => {
            startAutoScroll();
        }, 2000);
    }

    // Mouse events - attach to track instead of carousel for better control
    track.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    // Touch events
    track.addEventListener('touchstart', handleDragStart, { passive: true });
    track.addEventListener('touchmove', handleDragMove, { passive: false });
    track.addEventListener('touchend', handleDragEnd);

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', () => {
        if (!isDragging) {
            startAutoScroll();
        }
    });

    // Prevent image dragging
    carousel.addEventListener('dragstart', (e) => e.preventDefault());

    // Keyboard navigation (arrow keys)
    document.addEventListener('keydown', (e) => {
        // Only activate if carousel is in view
        const rect = carousel.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isInView) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollBy(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollBy(1);
        }
    });

    // Handle window visibility (pause when tab is not active)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoScroll();
        } else {
            startAutoScroll();
        }
    });

    // Initialize
    track.style.transition = 'transform 0.5s ease';
    startAutoScroll();

    // Update on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            itemWidth = getItemWidth();
            maxScroll = originalItemCount * itemWidth;

            // Recalculate position based on current card index
            currentPosition = currentIndex * itemWidth;
            track.style.transform = `translateX(-${currentPosition}px)`;
        }, 250);
    });

    // Click to enlarge - lightbox functionality
    items.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                // Only trigger if not dragging
                if (!hasDragged) {
                    openEventFlyerLightbox(img.src, img.alt || 'Event Flyer');
                }
            });
        }
    });

    console.log('Event carousel initialized with auto-scroll');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initializeEventCarousel);

// Reinitialize when CMS updates content
document.addEventListener('carouselContentUpdated', () => {
    console.log('Carousel content updated, reinitializing...');
    initializeEventCarousel();
});

// ===================================
// EVENT FLYER LIGHTBOX
// ===================================
function openEventFlyerLightbox(imageSrc, caption) {
    // Create lightbox if it doesn't exist
    let lightbox = document.getElementById('eventFlyerLightbox');

    if (!lightbox) {
        const lightboxHTML = `
            <div id="eventFlyerLightbox" class="event-flyer-lightbox">
                <span class="flyer-lightbox-close">&times;</span>
                <img class="flyer-lightbox-content" id="flyerLightboxImg" alt="Event Flyer">
                <div class="flyer-lightbox-caption" id="flyerLightboxCaption"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);

        lightbox = document.getElementById('eventFlyerLightbox');
        const closeBtn = document.querySelector('.flyer-lightbox-close');

        // Close on X button click
        closeBtn.addEventListener('click', closeEventFlyerLightbox);

        // Close on outside click
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeEventFlyerLightbox();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeEventFlyerLightbox();
            }
        });
    }

    // Show lightbox with image
    const lightboxImg = document.getElementById('flyerLightboxImg');
    const lightboxCaption = document.getElementById('flyerLightboxCaption');

    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeEventFlyerLightbox() {
    const lightbox = document.getElementById('eventFlyerLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}
