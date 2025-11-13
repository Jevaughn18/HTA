// ===================================
// HORIZONTAL EVENT CAROUSEL
// Auto-scrolling with manual controls
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('eventCarousel');

    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const items = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    if (!track || items.length === 0) return;

    // Configuration
    const itemWidth = 350 + 24; // item width (350px) + gap (1.5rem = 24px)
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

    // Responsive adjustments
    function updateCarouselDimensions() {
        const windowWidth = window.innerWidth;

        if (windowWidth <= 480) {
            // Mobile: smaller items
            const mobileItemWidth = 250 + 24;
            return mobileItemWidth;
        } else if (windowWidth <= 768) {
            // Tablet: medium items
            const tabletItemWidth = 280 + 24;
            return tabletItemWidth;
        }

        return itemWidth; // Desktop
    }

    // Update on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newItemWidth = updateCarouselDimensions();
            // Adjust current position proportionally
            const ratio = newItemWidth / itemWidth;
            currentPosition *= ratio;
            track.style.transform = `translateX(-${currentPosition}px)`;
        }, 250);
    });

    console.log('Event carousel initialized with auto-scroll');
});
