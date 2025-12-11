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

    // Configuration - Dynamic based on screen size
    function getItemWidth() {
        const windowWidth = window.innerWidth;
        if (windowWidth <= 480) return 280 + 16; // mobile small
        if (windowWidth <= 767) return 350 + 24; // mobile medium
        if (windowWidth <= 912) return 450 + 28; // tablet portrait
        if (windowWidth <= 1200) return 500 + 28; // tablet landscape
        if (windowWidth <= 1400) return 550 + 32; // desktop small
        return 600 + 32; // desktop large (600px + 2rem gap)
    }

    let itemWidth = getItemWidth();
    const scrollSpeed = 1; // pixels per frame
    const autoScrollInterval = 30; // milliseconds between frames (faster = smoother)

    let currentPosition = 0;
    let isAutoScrolling = true;
    let autoScrollTimer = null;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    // Count duplicates by checking for the comment "Duplicates for seamless loop"
    // All items before that comment are originals
    let originalItemCount = 0;
    const trackHTML = track.innerHTML;
    const duplicateMarkerIndex = trackHTML.indexOf('Duplicates for seamless loop');

    if (duplicateMarkerIndex !== -1) {
        // Count items before the duplicate marker
        const itemsBeforeDuplicates = track.innerHTML.substring(0, duplicateMarkerIndex);
        originalItemCount = (itemsBeforeDuplicates.match(/carousel-item/g) || []).length;
    } else {
        // Fallback: assume last 4 items are duplicates
        originalItemCount = items.length - 4;
    }

    const maxScroll = originalItemCount * itemWidth;

    console.log(`Carousel has ${items.length} total items, ${originalItemCount} originals, ${items.length - originalItemCount} duplicates`);

    // Auto-scroll function
    function autoScroll() {
        if (!isAutoScrolling || isDragging) return;

        currentPosition += scrollSpeed;

        // Check if we've scrolled past the original set
        if (currentPosition >= maxScroll) {
            // Jump back to the start without transition
            track.style.transition = 'none';
            currentPosition = 0;
            track.style.transform = `translateX(-${currentPosition}px)`;

            // Re-enable transition after a brief moment
            setTimeout(() => {
                track.style.transition = 'transform 0.5s ease';
            }, 50);
        } else {
            track.style.transform = `translateX(-${currentPosition}px)`;
        }
    }

    // Start auto-scrolling
    function startAutoScroll() {
        if (autoScrollTimer) return;
        isAutoScrolling = true;
        autoScrollTimer = setInterval(autoScroll, autoScrollInterval);
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

        const scrollAmount = itemWidth * 1; // Scroll 1 item at a time for smoother control
        currentPosition += direction * scrollAmount;

        // Handle infinite wrapping
        if (currentPosition < 0) {
            // Wrap to end
            track.style.transition = 'none';
            currentPosition = maxScroll + currentPosition;
            track.style.transform = `translateX(-${currentPosition}px)`;

            // Re-enable transition and continue
            setTimeout(() => {
                track.style.transition = 'transform 0.5s ease';
                currentPosition += direction * scrollAmount;
                track.style.transform = `translateX(-${currentPosition}px)`;
            }, 50);
        } else if (currentPosition >= maxScroll) {
            // Wrap to start
            track.style.transition = 'transform 0.5s ease';
            track.style.transform = `translateX(-${currentPosition}px)`;

            // After animation, jump to start
            setTimeout(() => {
                track.style.transition = 'none';
                currentPosition = currentPosition - maxScroll;
                track.style.transform = `translateX(-${currentPosition}px)`;

                // Re-enable transition
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease';
                }, 50);
            }, 500);
        } else {
            // Normal scroll
            track.style.transition = 'transform 0.5s ease';
            track.style.transform = `translateX(-${currentPosition}px)`;
        }

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

        // Resume auto-scroll after 5 seconds
        setTimeout(() => {
            startAutoScroll();
        }, 5000);
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
            const oldItemWidth = itemWidth;
            itemWidth = getItemWidth();

            // Adjust current position proportionally
            const ratio = itemWidth / oldItemWidth;
            currentPosition *= ratio;
            track.style.transform = `translateX(-${currentPosition}px)`;
        }, 250);
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
