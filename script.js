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

        // Hero text scroll effect - fade out and move up as user scrolls
        const heroContent = document.querySelector('.hero-video-content');
        if (heroContent) {
            const scrollPercent = Math.min(currentScroll / (window.innerHeight * 0.5), 1);
            const opacity = 1 - scrollPercent;
            const translateY = -currentScroll * 0.8;

            heroContent.style.opacity = opacity;
            heroContent.style.transform = `translate(-50%, calc(-50% + ${translateY}px))`;

            // Hide completely after scrolling past hero
            if (currentScroll > window.innerHeight * 0.5) {
                heroContent.style.display = 'none';
            } else {
                heroContent.style.display = 'block';
            }
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
    // INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    // ===================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe sections for smooth fade-in animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('section-animate');
        observer.observe(section);
    });

    // Observe ministry sections with alternating animations
    const ministryContainers = document.querySelectorAll('.ministry-container');
    ministryContainers.forEach((container, index) => {
        const image = container.querySelector('.ministry-image');
        const content = container.querySelector('.ministry-content');

        if (image && content) {
            if (index % 2 === 0) {
                image.classList.add('slide-from-left');
                content.classList.add('slide-from-right');
            } else {
                image.classList.add('slide-from-right');
                content.classList.add('slide-from-left');
            }

            const ministryObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            image.classList.add('visible');
                        }, 100);
                        setTimeout(() => {
                            content.classList.add('visible');
                        }, 300);
                    }
                });
            }, { threshold: 0.2 });

            ministryObserver.observe(container);
        }
    });

    // Observe headings for fade-in effect
    const headings = document.querySelectorAll('h2, h3');
    headings.forEach((heading, index) => {
        heading.style.opacity = '0';
        heading.style.transform = 'translateY(20px)';
        heading.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        heading.style.transitionDelay = `${index * 0.05}s`;

        const headingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.5 });

        headingObserver.observe(heading);
    });

    // Add stagger animation to grid items
    const gridContainers = document.querySelectorAll('.service-info-cards, .next-steps-grid, .events-grid, .staff-grid, .messages-grid');
    gridContainers.forEach(container => {
        const items = container.children;
        Array.from(items).forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

            const itemObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });

            itemObserver.observe(item);
        });
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
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const icon = header.querySelector('i');

        if (header && content) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all items
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    const otherIcon = otherItem.querySelector('.accordion-header i');
                    if (otherContent) {
                        otherContent.style.maxHeight = null;
                    }
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-chevron-up');
                        otherIcon.classList.add('fa-chevron-down');
                    }
                });

                // If the clicked item was not already active, open it
                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    if (icon) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                }
            });
        }
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
    // PARALLAX EFFECT FOR HERO VIDEO
    // ===================================
    const heroVideos = document.querySelectorAll('.hero-video-bg');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        heroVideos.forEach(video => {
            if (scrolled < window.innerHeight) {
                video.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    });

    // ===================================
    // SMOOTH ENTRANCE ANIMATIONS
    // ===================================
    // Add entrance animation to navigation
    setTimeout(() => {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 100);

    // Initial header state
    header.style.opacity = '0';
    header.style.transform = 'translateY(-20px)';
    header.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    // ===================================
    // GOLD UNDERLINE ANIMATION
    // ===================================
    const goldUnderlines = document.querySelectorAll('.gold-underline, .wave-underline, .gold-underline-white, .wave-underline-white');
    goldUnderlines.forEach(underline => {
        underline.style.opacity = '0';
        underline.style.transform = 'scaleX(0)';
        underline.style.transformOrigin = 'left';
        underline.style.transition = 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s';

        const underlineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scaleX(1)';
                }
            });
        }, { threshold: 0.5 });

        underlineObserver.observe(underline);
    });

    // ===================================
    // PAGE LOADER
    // ===================================
    window.addEventListener('load', () => {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 300);
        }
    });

    // ===================================
    // IMAGE LIGHTBOX FOR HISTORY IMAGES
    // ===================================
    initializeImageLightbox();

    document.addEventListener('carouselContentUpdated', initializeEventLightbox);

    // ===================================
    // LOG INITIALIZATION
    // ===================================
    console.log('Harvest Temple Apostolic website initialized');
    console.log('Design based on Legacy Hills Church');
    console.log('Smooth animations active');
});

// ===================================
// EVENT PHOTO GALLERY CAROUSEL
// ===================================

// Event photo galleries data
// TODO: Replace these placeholder images with actual event photos
const eventGalleries = {
    'youth-camp': {
        title: 'Youth Camp',
        date: 'August 10–16 2025',
        photos: [
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg',
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg',
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg',
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg'
        ]
    },
    'family-day': {
        title: 'Family Day Celebration',
        date: 'October 2024',
        photos: [
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg',
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg',
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg',
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg',
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg',
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg'
        ]
    },
    'youth-conference': {
        title: 'Youth Conference',
        date: 'September 2024',
        photos: [
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg',
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg',
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg',
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg',
            'church.jpeg',
            'convocation.jpg',
            'camp.jpg'
        ]
    }
};

let currentGallery = null;
let currentSlideIndex = 0;
let autoPlayInterval = null;
let isAutoPlaying = true;
const AUTO_PLAY_SPEED = 3000; // 3 seconds

// Open event gallery modal
function openEventGallery(eventId) {
    const gallery = eventGalleries[eventId];
    if (!gallery) return;

    currentGallery = gallery;
    currentSlideIndex = 0;
    isAutoPlaying = true;

    const modal = document.getElementById('galleryModal');
    const title = document.getElementById('galleryTitle');
    const date = document.getElementById('galleryDate');
    const totalSlides = document.getElementById('totalSlides');

    title.textContent = gallery.title;
    date.textContent = gallery.date;
    totalSlides.textContent = gallery.photos.length;

    // Generate thumbnails
    generateThumbnails();

    // Show first photo
    showSlide(0);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyPress);

    // Start auto-play
    startAutoPlay();
}

// Close event gallery modal
function closeEventGallery() {
    const modal = document.getElementById('galleryModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentGallery = null;

    // Stop auto-play
    stopAutoPlay();

    // Remove keyboard navigation
    document.removeEventListener('keydown', handleKeyPress);
}

// Show specific slide
function showSlide(index) {
    if (!currentGallery) return;

    const photos = currentGallery.photos;

    // Wrap around
    if (index >= photos.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = photos.length - 1;
    } else {
        currentSlideIndex = index;
    }

    // Update main image
    const carouselImage = document.getElementById('carouselImage');
    carouselImage.src = photos[currentSlideIndex];
    carouselImage.alt = `${currentGallery.title} - Photo ${currentSlideIndex + 1}`;

    // Update counter
    document.getElementById('currentSlide').textContent = currentSlideIndex + 1;

    // Update active thumbnail
    updateActiveThumbnail();
}

// Change slide (next/previous)
function changeSlide(direction) {
    // Stop auto-play when user manually navigates
    stopAutoPlay();
    isAutoPlaying = false;

    showSlide(currentSlideIndex + direction);

    // Restart auto-play after 5 seconds of inactivity
    setTimeout(() => {
        if (currentGallery) {
            isAutoPlaying = true;
            startAutoPlay();
        }
    }, 5000);
}

// Generate thumbnail gallery
function generateThumbnails() {
    if (!currentGallery) return;

    const thumbnailsContainer = document.getElementById('carouselThumbnails');
    thumbnailsContainer.innerHTML = '';

    currentGallery.photos.forEach((photo, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'carousel-thumbnail';
        if (index === 0) thumbnail.classList.add('active');

        const img = document.createElement('img');
        img.src = photo;
        img.alt = `Thumbnail ${index + 1}`;
        img.loading = 'lazy';

        thumbnail.appendChild(img);
        thumbnail.addEventListener('click', () => {
            // Stop auto-play when user clicks thumbnail
            stopAutoPlay();
            isAutoPlaying = false;

            showSlide(index);

            // Restart auto-play after 5 seconds of inactivity
            setTimeout(() => {
                if (currentGallery) {
                    isAutoPlaying = true;
                    startAutoPlay();
                }
            }, 5000);
        });

        thumbnailsContainer.appendChild(thumbnail);
    });
}

// Update active thumbnail
function updateActiveThumbnail() {
    const thumbnails = document.querySelectorAll('.carousel-thumbnail');
    thumbnails.forEach((thumb, index) => {
        if (index === currentSlideIndex) {
            thumb.classList.add('active');
            // Scroll thumbnail into view
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Handle keyboard navigation
function handleKeyPress(e) {
    if (!currentGallery) return;

    switch(e.key) {
        case 'ArrowLeft':
            changeSlide(-1);
            break;
        case 'ArrowRight':
            changeSlide(1);
            break;
        case 'Escape':
            closeEventGallery();
            break;
    }
}

// Start auto-play
function startAutoPlay() {
    if (!isAutoPlaying) return;

    stopAutoPlay(); // Clear any existing interval

    autoPlayInterval = setInterval(() => {
        if (!currentGallery || !isAutoPlaying) {
            stopAutoPlay();
            return;
        }

        // Move to next slide (infinite loop)
        currentSlideIndex = (currentSlideIndex + 1) % currentGallery.photos.length;
        showSlide(currentSlideIndex);
    }, AUTO_PLAY_SPEED);
}

// Stop auto-play
function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// Pause auto-play on hover
function pauseAutoPlay() {
    stopAutoPlay();
}

// Resume auto-play when mouse leaves
function resumeAutoPlay() {
    if (currentGallery && isAutoPlaying) {
        startAutoPlay();
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('galleryModal');
    if (e.target === modal) {
        closeEventGallery();
    }
});

// Add hover listeners to carousel container for auto-play pause/resume
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel-container');
    const thumbnailsContainer = document.getElementById('carouselThumbnails');

    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', pauseAutoPlay);
        carouselContainer.addEventListener('mouseleave', resumeAutoPlay);
    }

    if (thumbnailsContainer) {
        thumbnailsContainer.addEventListener('mouseenter', pauseAutoPlay);
        thumbnailsContainer.addEventListener('mouseleave', resumeAutoPlay);
    }
});

// ===================================
// IMAGE LIGHTBOX FUNCTIONALITY
// ===================================
function initializeImageLightbox() {
    // Create lightbox modal
    const lightboxHTML = `
        <div id="imageLightbox" class="image-lightbox">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-content" id="lightboxImg">
            <div class="lightbox-caption" id="lightboxCaption"></div>
        </div>
    `;

    // Add lightbox to body if not exists
    if (!document.getElementById('imageLightbox')) {
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.lightbox-close');

    // Add click handlers to all history images and story images
    const historyImages = document.querySelectorAll('.history-image-item img, .story-image img');
    historyImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            lightbox.style.display = 'block';
            lightboxImg.src = this.src;

            // Get caption from the image's sibling caption element
            const captionElement = this.parentElement.querySelector('.image-caption');
            if (captionElement) {
                lightboxCaption.innerHTML = captionElement.innerHTML;
            }

            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox when clicking X
    closeBtn.addEventListener('click', closeLightbox);

    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function initializeEventLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    if (!lightbox) return; // Make sure lightbox exists

    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');

    const eventItems = document.querySelectorAll('#eventCarousel .carousel-item');
    eventItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                lightbox.style.display = 'block';
                lightboxImg.src = img.src;
                lightboxCaption.innerHTML = img.alt; // Use alt text for caption
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // ===================================
    // HERO GALLERY LAZY LOADING WITH WEBP
    // ===================================
    lazyLoadHeroGallery();
}

function lazyLoadHeroGallery() {
    const galleryImages = document.querySelectorAll('.gallery-cell img.gallery-img');

    if (!galleryImages.length) return;

    // Create 1px transparent placeholder
    const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';

    // Set up intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const picture = img.parentElement;

                // If it's inside a picture element, load sources
                if (picture.tagName === 'PICTURE') {
                    const sources = picture.querySelectorAll('source');
                    sources.forEach(source => {
                        if (source.dataset.srcset) {
                            source.srcset = source.dataset.srcset;
                        }
                    });
                }

                // Load the img src
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }

                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px', // Start loading 50px before visible
        threshold: 0.01
    });

    // Set placeholder and observe each image
    galleryImages.forEach(img => {
        // Store original src
        if (!img.dataset.src && img.getAttribute('src')) {
            img.dataset.src = img.getAttribute('src');
        }

        // Store source srcset in data attribute
        const picture = img.parentElement;
        if (picture.tagName === 'PICTURE') {
            const sources = picture.querySelectorAll('source');
            sources.forEach(source => {
                if (source.srcset && !source.dataset.srcset) {
                    source.dataset.srcset = source.srcset;
                    source.removeAttribute('srcset');
                }
            });
        }

        // Set placeholder
        img.src = placeholder;
        imageObserver.observe(img);
    });

    console.log(`🖼️ Lazy loading initialized for ${galleryImages.length} hero gallery images`);
}