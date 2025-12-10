/**
 * CMS Content Loader
 * Dynamically loads images from the CMS API and updates the page
 */

// Determine API base URL based on environment
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5001'
    : 'https://hta-kwfr.onrender.com';

console.log('[CMS] Using API base URL:', API_BASE_URL);

(async function loadCMSImages() {
    try {
        // Detect current page from the URL
        const path = window.location.pathname;
        const pageName = path.substring(path.lastIndexOf('/') + 1).replace('.html', '') || 'index';
        const page = pageName === 'index' ? 'home' : pageName;

        console.log('[CMS] Loading images for page:', page);

        // Fetch content from CMS
        const response = await fetch(`${API_BASE_URL}/api/content/${page}`);
        if (!response.ok) {
            console.warn('[CMS] No content found for page:', page);
            return;
        }

        const content = await response.json();
        console.log('[CMS] Loaded', content.length, 'sections from CMS');

        // Process each section
        content.forEach(section => {
            updateImagesInSection(section, page);
        });

    } catch (error) {
        console.error('[CMS] Error loading images:', error);
    }
})();

/**
 * Update images in a section
 */
function updateImagesInSection(section, page) {
    const sectionName = section.section;
    const sectionContent = section.content;

    console.log('[CMS] Processing section:', sectionName);

    // Handle different section types
    switch (page) {
        case 'home':
            if (sectionName === 'hero') {
                updateHeroSection(sectionContent);
            } else if (sectionName === 'service-details') {
                updateServiceDetails(sectionContent);
            } else if (sectionName === 'next-steps') {
                updateNextSteps(sectionContent);
            } else if (sectionName === 'generosity') {
                updateGenerositySection(sectionContent);
            } else if (sectionName === 'our-vision') {
                updateOurVision(sectionContent);
            } else if (sectionName === 'upcoming-events') {
                updateUpcomingEvents(sectionContent);
            }
            break;
        case 'about':
            if (sectionName === 'hero') {
                updateAboutHero(sectionContent);
            } else if (sectionName === 'who-we-are') {
                updateWhoWeAre(sectionContent);
            } else if (sectionName === 'what-we-believe') {
                updateWhatWeBelieve(sectionContent);
            } else if (sectionName === 'our-name') {
                updateOurName(sectionContent);
            } else if (sectionName === 'our-history') {
                updateOurHistory(sectionContent);
            } else if (sectionName === 'our-team') {
                updateOurTeam(sectionContent);
            }
            break;
        case 'events':
            if (sectionName === 'hero') {
                updateEventsHero(sectionContent);
            } else if (sectionName === 'upcoming-events') {
                updateEventsListing(sectionContent);
            } else if (sectionName === 'past-events') {
                updatePastEvents(sectionContent);
            } else {
                updateGenericImages(sectionContent, sectionName);
            }
            break;
        case 'give':
            if (sectionName === 'hero') {
                updateGiveHero(sectionContent);
            } else if (sectionName === 'ways-to-give') {
                updateWaysToGive(sectionContent);
            } else if (sectionName === 'why-we-give') {
                updateWhyWeGive(sectionContent);
            } else {
                updateGenericImages(sectionContent, sectionName);
            }
            break;
        case 'media':
            updateMediaPage(sectionContent, sectionName);
            break;
        case 'departments':
            updateDepartmentImages(sectionContent, sectionName);
            break;
        case 'contact':
            if (sectionName === 'faq') {
                updateFAQSection(sectionContent);
            } else if (sectionName === 'what-to-expect') {
                updateWhatToExpect(sectionContent);
            } else {
                updateContactPage(sectionContent, sectionName);
            }
            break;
        default:
            // For any other page, try generic image updates
            updateGenericImages(sectionContent, sectionName);
    }
}

/**
 * Update hero section on home page (title, subtitle, and gallery)
 */
function updateHeroSection(content) {
    // Update hero title if provided
    if (content.title) {
        const heroTitle = document.querySelector('.hero-video-content h1');
        if (heroTitle) {
            heroTitle.textContent = content.title;
            console.log('[CMS] Updated hero title:', content.title);
        }
    }

    // Update hero subtitle if provided
    if (content.subtitle) {
        const heroSubtitle = document.querySelector('.hero-video-content p');
        if (heroSubtitle) {
            heroSubtitle.textContent = content.subtitle;
            console.log('[CMS] Updated hero subtitle:', content.subtitle);
        }
    }

    if (!content.galleryImages) return;

    const heroGallery = document.getElementById('heroGallery');
    if (heroGallery && content.galleryImages.length > 0) {
        console.log('[CMS] Updating hero gallery with', content.galleryImages.length, 'images');

        heroGallery.innerHTML = content.galleryImages.map(img => {
            const imagePath = img.src.startsWith('/') ? img.src.substring(1) : img.src;
            const imgSrc = img.src.startsWith('http') ? img.src : `${API_BASE_URL}/${imagePath}`;
            const className = img.class ? `gallery-cell ${img.class}` : 'gallery-cell';
            return `<div class="${className}" style="background-image: url('${imgSrc}');"></div>`;
        }).join('');

        console.log('[CMS] Hero gallery updated!');
    }

    // Update vision carousel
    const visionCarousel = document.getElementById('visionCarousel');
    if (visionCarousel && content.galleryImages) {
        const visionImages = content.galleryImages.slice(0, 10);
        visionCarousel.innerHTML = visionImages.map((img, idx) => {
            const imagePath = img.src.startsWith('/') ? img.src.substring(1) : img.src;
            const imgSrc = img.src.startsWith('http') ? img.src : `${API_BASE_URL}/${imagePath}`;
            const alt = img.alt || `Gallery image ${idx + 1}`;
            return `<div class="gallery-item"><img src="${imgSrc}" alt="${alt}" loading="lazy"></div>`;
        }).join('');
    }
}

/**
 * Update Service Details section on home page
 */
function updateServiceDetails(content) {
    console.log('[CMS] Updating service details section');

    // Update section label
    if (content.label) {
        const label = document.querySelector('#service-details .section-label, .service-details .section-label');
        if (label) {
            label.textContent = content.label;
            console.log('[CMS] Updated service details label:', content.label);
        }
    }

    // Update title
    if (content.title) {
        const title = document.querySelector('#service-details h2, .service-details h2, .service-text h2');
        if (title) {
            title.textContent = content.title;
            console.log('[CMS] Updated service details title:', content.title);
        }
    }

    // Update main description (first paragraph)
    if (content.description) {
        const desc = document.querySelector('#service-details .service-text p:first-of-type, .service-details .service-text p:first-of-type');
        if (desc) {
            desc.textContent = content.description;
            console.log('[CMS] Updated service details description');
        }
    }

    // Update secondary description (second paragraph with em)
    if (content.secondaryDescription) {
        const secondaryDesc = document.querySelector('#service-details .service-text p:nth-of-type(2) em, .service-details .service-text p:nth-of-type(2) em');
        if (secondaryDesc) {
            secondaryDesc.textContent = content.secondaryDescription;
        }
    }

    // Update service times in the info card
    if (content.mainServiceTime) {
        const mainTimeEl = document.querySelector('#service-details .info-card h3:first-of-type, .service-info-cards .info-card h3:first-of-type');
        if (mainTimeEl) {
            mainTimeEl.textContent = content.mainServiceTime;
            console.log('[CMS] Updated main service time:', content.mainServiceTime);
        }
    }

    if (content.mainServiceLabel) {
        const mainLabelEl = document.querySelector('#service-details .info-card p:first-of-type, .service-info-cards .info-card p:first-of-type');
        if (mainLabelEl) {
            mainLabelEl.textContent = content.mainServiceLabel;
        }
    }

    if (content.sundaySchoolTime) {
        const schoolTimeEl = document.querySelector('#service-details .info-card h3:nth-of-type(2), .service-info-cards .info-card h3:nth-of-type(2)');
        if (schoolTimeEl) {
            schoolTimeEl.textContent = content.sundaySchoolTime;
        }
    }

    if (content.sundaySchoolLabel) {
        const schoolLabelEl = document.querySelector('#service-details .info-card p:nth-of-type(2), .service-info-cards .info-card p:nth-of-type(2)');
        if (schoolLabelEl) {
            schoolLabelEl.textContent = content.sundaySchoolLabel;
        }
    }

    // Update location cards
    if (content.locations && Array.isArray(content.locations)) {
        const locationCards = document.querySelectorAll('.location-card');
        console.log('[CMS] Found', locationCards.length, 'location cards');

        content.locations.forEach((location, idx) => {
            if (locationCards[idx]) {
                const card = locationCards[idx];

                // Update location name
                if (location.name) {
                    const nameEl = card.querySelector('h3');
                    if (nameEl) {
                        nameEl.textContent = location.name;
                        console.log('[CMS] Updated location name:', location.name);
                    }
                }

                // Update pastor name
                if (location.pastor) {
                    const pastorEl = card.querySelector('.pastor-name');
                    if (pastorEl) {
                        pastorEl.textContent = location.pastor;
                        console.log('[CMS] Updated pastor name:', location.pastor);
                    }
                }

                // Update address
                if (location.address) {
                    const addressEl = card.querySelector('.address');
                    if (addressEl) {
                        addressEl.innerHTML = location.address.replace('\n', '<br>');
                        console.log('[CMS] Updated address');
                    }
                }

                // Update badge if provided
                if (location.badge) {
                    const badgeEl = card.querySelector('.badge');
                    if (badgeEl) {
                        badgeEl.textContent = location.badge;
                    }
                }
            }
        });
        console.log('[CMS] Updated', content.locations.length, 'location cards');
    }
}

/**
 * Update Next Steps section on home page
 */
function updateNextSteps(content) {
    console.log('[CMS] Updating next steps section');

    // Update title
    if (content.title) {
        const title = document.querySelector('.next-steps h2, .next-steps-header h2, .ministries-grid-section h2');
        if (title) {
            title.textContent = content.title;
            console.log('[CMS] Updated next steps title:', content.title);
        }
    }

    // Update description
    if (content.description) {
        const desc = document.querySelector('.next-steps-header > p, .next-steps .section-intro, .ministries-grid-section .section-intro');
        if (desc) {
            desc.textContent = content.description;
            console.log('[CMS] Updated next steps description:', content.description);
        }
    }

    // Update step cards
    if (content.steps && Array.isArray(content.steps)) {
        const stepCards = document.querySelectorAll('.next-step-card, .ministry-card');
        content.steps.forEach((step, idx) => {
            if (stepCards[idx]) {
                const card = stepCards[idx];

                // Update image
                if (step.image) {
                    const img = card.querySelector('img');
                    if (img) {
                        const imagePath = step.image.startsWith('/') ? step.image.substring(1) : step.image;
                        img.src = step.image.startsWith('http') ? step.image : `${API_BASE_URL}/${imagePath}`;
                    }
                }

                // Update title
                if (step.title) {
                    const titleEl = card.querySelector('h3');
                    if (titleEl) titleEl.textContent = step.title;
                }

                // Update description
                if (step.description) {
                    const descEl = card.querySelector('.card-overlay p, p');
                    if (descEl) descEl.textContent = step.description;
                }

                // Update button text/link if provided
                if (step.buttonText) {
                    const btn = card.querySelector('.btn, a.btn');
                    if (btn) {
                        btn.innerHTML = `${step.buttonText} <i class="fas fa-arrow-right"></i>`;
                        if (step.buttonLink) btn.href = step.buttonLink;
                    }
                }
            }
        });
        console.log('[CMS] Updated', content.steps.length, 'next step cards');
    }
}

/**
 * Update Generosity section on home page
 */
function updateGenerositySection(content) {
    console.log('[CMS] Updating generosity section');

    // Update title
    if (content.title) {
        const title = document.querySelector('.give-section h2, .generosity-section h2');
        if (title) title.textContent = content.title;
    }

    // Update description
    if (content.description) {
        const desc = document.querySelector('.give-section .section-intro, .generosity-section .section-intro, .give-section p');
        if (desc) desc.textContent = content.description;
    }

    // Update buttons
    if (content.buttons && Array.isArray(content.buttons)) {
        const buttons = document.querySelectorAll('.give-section .btn, .generosity-section .btn');
        content.buttons.forEach((button, idx) => {
            if (buttons[idx] && button.text) {
                buttons[idx].textContent = button.text;
                if (button.link) buttons[idx].href = button.link;
            }
        });
    }
}

/**
 * Update Our Vision section on home page
 */
function updateOurVision(content) {
    console.log('[CMS] Updating our vision section');

    // Update label
    if (content.label) {
        const label = document.querySelector('.vision-section .section-label, .about-preview .section-label');
        if (label) label.textContent = content.label;
    }

    // Update title
    if (content.title) {
        const title = document.querySelector('.vision-section h2, .about-preview h2');
        if (title) title.textContent = content.title;
    }

    // Update paragraphs
    if (content.paragraphs && Array.isArray(content.paragraphs)) {
        const paragraphs = document.querySelectorAll('.vision-section .vision-text p, .about-preview .about-text p');
        content.paragraphs.forEach((text, idx) => {
            if (paragraphs[idx]) {
                paragraphs[idx].textContent = text;
            }
        });
    }

    // Update gallery images
    if (content.galleryImages && Array.isArray(content.galleryImages)) {
        const gallery = document.querySelector('.vision-gallery, .about-gallery');
        if (gallery) {
            gallery.innerHTML = content.galleryImages.map((img, idx) => {
                const imagePath = img.src.startsWith('/') ? img.src.substring(1) : img.src;
                const imgSrc = img.src.startsWith('http') ? img.src : `${API_BASE_URL}/${imagePath}`;
                const alt = img.alt || `Vision gallery image ${idx + 1}`;
                return `<div class="gallery-item"><img src="${imgSrc}" alt="${alt}" loading="lazy"></div>`;
            }).join('');
        }
    }
}

/**
 * Update Upcoming Events section on home page
 */
function updateUpcomingEvents(content) {
    console.log('[CMS] Updating upcoming events section');

    // Update title
    if (content.title) {
        const title = document.querySelector('.events-preview h2, .upcoming-events h2');
        if (title) title.textContent = content.title;
    }

    // Update event cards - dynamically create/update cards based on CMS data
    if (content.events && Array.isArray(content.events)) {
        const eventsGrid = document.querySelector('.events-grid');
        if (eventsGrid) {
            // Clear existing cards
            eventsGrid.innerHTML = '';

            // Create cards for each event (up to 4)
            content.events.slice(0, 4).forEach((event, idx) => {
                const card = document.createElement('div');
                card.className = 'event-card';

                // Create image
                const img = document.createElement('img');
                if (event.image) {
                    const imagePath = event.image.startsWith('/') ? event.image.substring(1) : event.image;
                    img.src = event.image.startsWith('http') ? event.image : `${API_BASE_URL}/${imagePath}`;
                } else {
                    img.src = 'assets/bankspraise.jpg'; // Fallback image
                }

                // Set alt text with event info
                if (event.title && event.date) {
                    img.alt = `${event.title} - ${event.date}`;
                } else if (event.title) {
                    img.alt = event.title;
                } else {
                    img.alt = 'Event';
                }
                img.loading = 'lazy';

                // Create overlay with event details
                const overlay = document.createElement('div');
                overlay.className = 'event-card-overlay';

                // Add title if available
                if (event.title) {
                    const title = document.createElement('h3');
                    title.textContent = event.title;
                    overlay.appendChild(title);
                }

                // Add date if available
                if (event.date) {
                    const date = document.createElement('p');
                    date.innerHTML = `<i class="far fa-calendar"></i> ${event.date}`;
                    overlay.appendChild(date);
                }

                // Append elements to card
                card.appendChild(img);
                card.appendChild(overlay);
                eventsGrid.appendChild(card);

                console.log('[CMS] Created event card', idx + 1, ':', event.title || 'Untitled');
            });

            console.log('[CMS] Rendered', content.events.length, 'event cards');
        }
    }

    // Update button
    if (content.button && content.button.text) {
        const btn = document.querySelector('.events-preview .btn, .upcoming-events .btn');
        if (btn) {
            btn.textContent = content.button.text;
            if (content.button.link) btn.href = content.button.link;
        }
    }
}

/**
 * Update About page hero section
 */
function updateAboutHero(content) {
    console.log('[CMS] Updating about hero section');

    // Update title
    if (content.title) {
        const heroTitle = document.querySelector('.about-hero h1, .page-hero h1');
        if (heroTitle) {
            heroTitle.textContent = content.title;
            console.log('[CMS] Updated about hero title:', content.title);
        }
    }

    // Update video if provided
    if (content.videoSrc) {
        const video = document.querySelector('.about-hero video, .page-hero video');
        if (video) {
            const videoPath = content.videoSrc.startsWith('/') ? content.videoSrc.substring(1) : content.videoSrc;
            const videoSrc = content.videoSrc.startsWith('http') ? content.videoSrc : `${API_BASE_URL}/${videoPath}`;
            video.src = videoSrc;
            console.log('[CMS] Updated about hero video:', videoSrc);
        }
    }
}

/**
 * Update Who We Are section on about page
 */
function updateWhoWeAre(content) {
    console.log('[CMS] Updating who we are section');

    // Update label
    if (content.label) {
        const label = document.querySelector('#who-we-are .section-label, .who-we-are-content .section-label, .about-intro .section-label');
        if (label) {
            label.textContent = content.label;
            console.log('[CMS] Updated who we are label:', content.label);
        }
    }

    // Update title
    if (content.title) {
        const title = document.querySelector('#who-we-are h2, .who-we-are-content h2, .about-intro h2');
        if (title) {
            title.innerHTML = content.title.replace('\n', '<br>');
            console.log('[CMS] Updated who we are title:', content.title);
        }
    }

    // Update lead text
    if (content.leadText) {
        const leadText = document.querySelector('#who-we-are .lead-text, .who-we-are-content .lead-text, .about-intro .lead-text');
        if (leadText) {
            leadText.textContent = content.leadText;
            console.log('[CMS] Updated who we are lead text');
        }
    }

    // Update vision/mission cards
    if (content.visionMission && Array.isArray(content.visionMission)) {
        const cards = document.querySelectorAll('.vm-card, .value-card, .mission-card, .vision-card');
        console.log('[CMS] Found', cards.length, 'vision/mission cards');

        content.visionMission.forEach((item, idx) => {
            if (cards[idx]) {
                const card = cards[idx];

                // Note: Icons are NOT updated from CMS (user requested removal)
                // They are hardcoded in HTML

                // Update title
                if (item.title) {
                    const titleEl = card.querySelector('h3');
                    if (titleEl) {
                        titleEl.textContent = item.title;
                        console.log('[CMS] Updated vision/mission card title:', item.title);
                    }
                }

                // Update description
                if (item.description) {
                    const descEl = card.querySelector('p');
                    if (descEl) {
                        descEl.textContent = item.description;
                        console.log('[CMS] Updated vision/mission card description');
                    }
                }
            }
        });
        console.log('[CMS] Updated', content.visionMission.length, 'vision/mission cards');
    }
}

/**
 * Update What We Believe section on about page
 */
function updateWhatWeBelieve(content) {
    console.log('[CMS] Updating what we believe section');

    // Update title
    if (content.title) {
        const title = document.querySelector('#what-we-believe h2, .what-we-believe-section h2, .belief-container h2');
        if (title) {
            title.textContent = content.title;
            console.log('[CMS] Updated what we believe title:', content.title);
        }
    }

    // Update intro paragraphs (there are multiple)
    if (content.intro) {
        // If intro is a string, update the first paragraph
        if (typeof content.intro === 'string') {
            const intro = document.querySelector('#what-we-believe .belief-intro:first-of-type, .belief-container .belief-intro:first-of-type');
            if (intro) {
                intro.innerHTML = content.intro;
                console.log('[CMS] Updated first belief intro paragraph');
            }
        }
        // If intro is an array, update all paragraphs
        else if (Array.isArray(content.intro)) {
            const introParagraphs = document.querySelectorAll('#what-we-believe .belief-intro, .belief-container .belief-intro');
            content.intro.forEach((text, idx) => {
                if (introParagraphs[idx]) {
                    introParagraphs[idx].innerHTML = text;
                    console.log('[CMS] Updated belief intro paragraph', idx + 1);
                }
            });
        }
    }

    // Update articles of faith (accordion items)
    if (content.articles && Array.isArray(content.articles)) {
        const accordionItems = document.querySelectorAll('#what-we-believe .accordion-item, .belief-container .accordion-item');
        console.log('[CMS] Found', accordionItems.length, 'accordion items');

        content.articles.forEach((article, idx) => {
            if (accordionItems[idx]) {
                const accordionItem = accordionItems[idx];

                // Update article title (in the button span)
                if (article.title) {
                    const titleEl = accordionItem.querySelector('.accordion-header span, button span');
                    if (titleEl) {
                        titleEl.textContent = article.title;
                        console.log('[CMS] Updated article title:', article.title);
                    }
                }

                // Update article content (in the accordion-content div)
                if (article.content) {
                    const contentEl = accordionItem.querySelector('.accordion-content');
                    if (contentEl) {
                        // Replace the entire content with new HTML
                        contentEl.innerHTML = article.content;
                        console.log('[CMS] Updated article content for:', article.title);
                    }
                }
            }
        });
        console.log('[CMS] Updated', content.articles.length, 'articles of faith');
    }
}

/**
 * Update Our Name section on about page
 */
function updateOurName(content) {
    console.log('[CMS] Updating our name section');

    // Update label
    if (content.label) {
        const label = document.querySelector('#our-name .section-label, .our-name-section .section-label, .name-container .section-label');
        if (label) {
            label.textContent = content.label;
            console.log('[CMS] Updated our name label:', content.label);
        }
    }

    // Update title
    if (content.title) {
        const title = document.querySelector('#our-name h2, .our-name-section h2, .name-container h2');
        if (title) {
            title.textContent = content.title;
            console.log('[CMS] Updated our name title:', content.title);
        }
    }

    // Update paragraphs (NOT including the mission-quote paragraph)
    if (content.paragraphs && Array.isArray(content.paragraphs)) {
        // Select only regular paragraphs, not the conclusion/quote
        const paragraphs = document.querySelectorAll('#our-name p:not(.mission-quote), .name-container p:not(.mission-quote)');
        console.log('[CMS] Found', paragraphs.length, 'paragraphs in our name section');

        content.paragraphs.forEach((text, idx) => {
            if (paragraphs[idx]) {
                paragraphs[idx].innerHTML = text;
                console.log('[CMS] Updated paragraph', idx + 1);
            }
        });
        console.log('[CMS] Updated', content.paragraphs.length, 'paragraphs in our name section');
    }

    // Update conclusion if provided (the mission-quote paragraph)
    if (content.conclusion) {
        const conclusion = document.querySelector('#our-name .mission-quote, .name-container .mission-quote');
        if (conclusion) {
            conclusion.innerHTML = content.conclusion;
            console.log('[CMS] Updated our name conclusion');
        }
    }
}

/**
 * Update Our History section on about page (text and images)
 */
function updateOurHistory(content) {
    console.log('[CMS] Updating history section');

    // Update label
    if (content.label) {
        const label = document.querySelector('#our-story .section-label, .our-story-section .section-label, .story-content .section-label');
        if (label) {
            label.textContent = content.label;
            console.log('[CMS] Updated our history label:', content.label);
        }
    }

    // Update title
    if (content.title) {
        const title = document.querySelector('#our-story h2, .our-story-section h2, .story-content h2');
        if (title) {
            title.textContent = content.title;
            console.log('[CMS] Updated our history title:', content.title);
        }
    }

    // Update paragraphs (NOT including image captions)
    if (content.paragraphs && Array.isArray(content.paragraphs)) {
        // Select only the main content paragraphs, not image captions
        const paragraphs = document.querySelectorAll('#our-story .story-content > p, .story-content > p:not(.image-caption)');
        console.log('[CMS] Found', paragraphs.length, 'history paragraphs');

        content.paragraphs.forEach((text, idx) => {
            if (paragraphs[idx]) {
                paragraphs[idx].innerHTML = text;
                console.log('[CMS] Updated history paragraph', idx + 1);
            }
        });
        console.log('[CMS] Updated', content.paragraphs.length, 'history paragraphs');
    }

    // Update founder image (Bishop Carter)
    if (content.founderImage) {
        const founderImg = document.querySelector('.story-image img, .founder-image img');
        if (founderImg) {
            const imagePath = content.founderImage.src.startsWith('/') ? content.founderImage.src.substring(1) : content.founderImage.src;
            const imgSrc = content.founderImage.src.startsWith('http') ? content.founderImage.src : `${API_BASE_URL}/${imagePath}`;
            founderImg.src = imgSrc;
            console.log('[CMS] Updated founder image:', imgSrc);
        }

        // Update founder image caption
        if (content.founderImage.caption) {
            const caption = document.querySelector('.story-image .image-caption, .founder-image .caption');
            if (caption) caption.textContent = content.founderImage.caption;
        }

        // Update founder image subtitle
        if (content.founderImage.subtitle) {
            const subtitle = document.querySelector('.story-image .image-subtitle, .founder-image .subtitle');
            if (subtitle) subtitle.textContent = content.founderImage.subtitle;
        }
    }

    // Update history images (founding members and choir)
    if (content.historyImages && content.historyImages.length > 0) {
        const historyImageItems = document.querySelectorAll('.history-image-item img');
        content.historyImages.forEach((img, idx) => {
            if (historyImageItems[idx]) {
                const imagePath = img.src.startsWith('/') ? img.src.substring(1) : img.src;
                const imgSrc = img.src.startsWith('http') ? img.src : `${API_BASE_URL}/${imagePath}`;
                historyImageItems[idx].src = imgSrc;
                console.log('[CMS] Updated history image', idx + 1, ':', imgSrc);
            }
        });
    }

    // Update quote if provided
    if (content.quote) {
        const quoteEl = document.querySelector('.our-history blockquote, .history-section blockquote, .history-quote');
        if (quoteEl) quoteEl.textContent = content.quote;
    }
}

/**
 * Update Our Team section on about page (text and images)
 */
function updateOurTeam(content) {
    console.log('[CMS] Updating our team section');

    // Update title
    if (content.title) {
        const title = document.querySelector('.our-team h2, .team-section h2, .staff-section h2');
        if (title) title.textContent = content.title;
    }

    // Update staff members
    if (content.staff && Array.isArray(content.staff)) {
        content.staff.forEach((member, idx) => {
            const staffCard = document.querySelector(`.staff-card:nth-child(${idx + 1}), .staff-member:nth-child(${idx + 1}), .team-member:nth-child(${idx + 1})`);

            if (staffCard) {
                // Update image
                if (member.image) {
                    const staffImg = staffCard.querySelector('img');
                    if (staffImg) {
                        const imagePath = member.image.startsWith('/') ? member.image.substring(1) : member.image;
                        const imgSrc = member.image.startsWith('http') ? member.image : `${API_BASE_URL}/${imagePath}`;
                        staffImg.src = imgSrc;
                        console.log('[CMS] Updated team member image', idx + 1, ':', imgSrc);
                    }
                }

                // Update name
                if (member.name) {
                    const nameEl = staffCard.querySelector('h3, .staff-name, .member-name');
                    if (nameEl) nameEl.textContent = member.name;
                }

                // Update title/position
                if (member.title) {
                    const titleEl = staffCard.querySelector('.staff-title, .member-title, .position');
                    if (titleEl) titleEl.textContent = member.title;
                }

                // Update bio
                if (member.bio) {
                    const bioEl = staffCard.querySelector('p, .staff-bio, .member-bio');
                    if (bioEl) bioEl.textContent = member.bio;
                }
            } else {
                console.warn('[CMS] Could not find staff card element for member', idx + 1);
            }
        });
        console.log('[CMS] Updated', content.staff.length, 'team members');
    }
}

/**
 * Update Events page hero section
 */
function updateEventsHero(content) {
    console.log('[CMS] Updating events hero section');

    // Update title
    if (content.title) {
        const heroTitle = document.querySelector('.events-hero h1, .page-hero h1');
        if (heroTitle) heroTitle.textContent = content.title;
    }

    // Update subtitle
    if (content.subtitle) {
        const heroSubtitle = document.querySelector('.events-hero p, .page-hero p');
        if (heroSubtitle) heroSubtitle.textContent = content.subtitle;
    }
}

/**
 * Update Events listing section
 */
function updateEventsListing(content) {
    console.log('[CMS] Updating events listing section');

    // Update title
    if (content.title) {
        const title = document.querySelector('.events-listing h2, .upcoming-events h2');
        if (title) title.textContent = content.title;
    }

    // Update event cards
    if (content.events && Array.isArray(content.events)) {
        const eventCards = document.querySelectorAll('.event-card');
        content.events.forEach((event, idx) => {
            if (eventCards[idx]) {
                const card = eventCards[idx];

                // Update image
                if (event.image) {
                    const img = card.querySelector('img');
                    if (img) {
                        const imagePath = event.image.startsWith('/') ? event.image.substring(1) : event.image;
                        img.src = event.image.startsWith('http') ? event.image : `${API_BASE_URL}/${imagePath}`;
                    }
                }

                // Update title
                if (event.title) {
                    const titleEl = card.querySelector('h3');
                    if (titleEl) titleEl.textContent = event.title;
                }

                // Update date
                if (event.date) {
                    const dateEl = card.querySelector('.event-date, .date');
                    if (dateEl) dateEl.textContent = event.date;
                }

                // Update time
                if (event.time) {
                    const timeEl = card.querySelector('.event-time, .time');
                    if (timeEl) timeEl.textContent = event.time;
                }

                // Update location
                if (event.location) {
                    const locationEl = card.querySelector('.event-location, .location');
                    if (locationEl) locationEl.textContent = event.location;
                }

                // Update description
                if (event.description) {
                    const descEl = card.querySelector('p');
                    if (descEl) descEl.textContent = event.description;
                }
            }
        });
        console.log('[CMS] Updated', content.events.length, 'event cards');
    }
}

/**
 * Update Past Events section
 */
function updatePastEvents(content) {
    console.log('[CMS] Updating past events section');

    // Update title
    if (content.title) {
        const title = document.querySelector('.past-events h2');
        if (title) title.textContent = content.title;
    }

    // Update events similar to upcoming events
    if (content.events && Array.isArray(content.events)) {
        const eventCards = document.querySelectorAll('.past-events .event-card');
        content.events.forEach((event, idx) => {
            if (eventCards[idx]) {
                const card = eventCards[idx];

                if (event.image) {
                    const img = card.querySelector('img');
                    if (img) {
                        const imagePath = event.image.startsWith('/') ? event.image.substring(1) : event.image;
                        img.src = event.image.startsWith('http') ? event.image : `${API_BASE_URL}/${imagePath}`;
                    }
                }

                if (event.title) {
                    const titleEl = card.querySelector('h3');
                    if (titleEl) titleEl.textContent = event.title;
                }

                if (event.date) {
                    const dateEl = card.querySelector('.event-date, .date');
                    if (dateEl) dateEl.textContent = event.date;
                }
            }
        });
        console.log('[CMS] Updated', content.events.length, 'past event cards');
    }
}

/**
 * Update Give page hero section
 */
function updateGiveHero(content) {
    console.log('[CMS] Updating give hero section');

    // Update title
    if (content.title) {
        const heroTitle = document.querySelector('.give-hero h1, .page-hero h1');
        if (heroTitle) heroTitle.textContent = content.title;
    }

    // Update subtitle
    if (content.subtitle) {
        const heroSubtitle = document.querySelector('.give-hero p, .page-hero p');
        if (heroSubtitle) heroSubtitle.textContent = content.subtitle;
    }

    // Update verse if provided
    if (content.verse) {
        const verse = document.querySelector('.give-hero .verse, .scripture-verse');
        if (verse) verse.textContent = content.verse;
    }
}

/**
 * Update Ways to Give section
 */
function updateWaysToGive(content) {
    console.log('[CMS] Updating ways to give section');

    // Update title
    if (content.title) {
        const title = document.querySelector('.ways-to-give h2, .giving-methods h2');
        if (title) title.textContent = content.title;
    }

    // Update description
    if (content.description) {
        const desc = document.querySelector('.ways-to-give .section-intro, .giving-methods .section-intro');
        if (desc) desc.textContent = content.description;
    }

    // Update giving method cards
    if (content.methods && Array.isArray(content.methods)) {
        const methodCards = document.querySelectorAll('.giving-method-card, .method-card');
        content.methods.forEach((method, idx) => {
            if (methodCards[idx]) {
                const card = methodCards[idx];

                // Update icon if provided
                if (method.icon) {
                    const icon = card.querySelector('i, .icon');
                    if (icon) icon.className = method.icon;
                }

                // Update title
                if (method.title) {
                    const titleEl = card.querySelector('h3');
                    if (titleEl) titleEl.textContent = method.title;
                }

                // Update description
                if (method.description) {
                    const descEl = card.querySelector('p');
                    if (descEl) descEl.textContent = method.description;
                }

                // Update button
                if (method.buttonText) {
                    const btn = card.querySelector('.btn, button, a');
                    if (btn) {
                        btn.textContent = method.buttonText;
                        if (method.buttonLink) btn.href = method.buttonLink;
                    }
                }
            }
        });
        console.log('[CMS] Updated', content.methods.length, 'giving method cards');
    }
}

/**
 * Update Why We Give section
 */
function updateWhyWeGive(content) {
    console.log('[CMS] Updating why we give section');

    // Update title
    if (content.title) {
        const title = document.querySelector('.why-we-give h2, .giving-impact h2');
        if (title) title.textContent = content.title;
    }

    // Update description/intro
    if (content.description) {
        const desc = document.querySelector('.why-we-give .section-intro, .giving-impact .section-intro');
        if (desc) desc.textContent = content.description;
    }

    // Update reason cards/paragraphs
    if (content.reasons && Array.isArray(content.reasons)) {
        const reasonCards = document.querySelectorAll('.reason-card, .impact-card');
        content.reasons.forEach((reason, idx) => {
            if (reasonCards[idx]) {
                const card = reasonCards[idx];

                if (reason.title) {
                    const titleEl = card.querySelector('h3, h4');
                    if (titleEl) titleEl.textContent = reason.title;
                }

                if (reason.description) {
                    const descEl = card.querySelector('p');
                    if (descEl) descEl.textContent = reason.description;
                }
            }
        });
        console.log('[CMS] Updated', content.reasons.length, 'giving reasons');
    }
}

/**
 * Update department images on departments page
 */
function updateDepartmentImages(content, sectionName) {
    console.log('[CMS] Updating department images for section:', sectionName);

    // Map CMS section names to HTML aria-labels
    const sectionMap = {
        'youth-department': 'National Youth Department',
        'ladies-department': 'National Ladies Department',
        'mens-department': "Men's Department",
        'womens-department': "Women's Department",
        'sunday-school': 'Sunday School Department'
    };

    const ariaLabel = sectionMap[sectionName];

    if (!ariaLabel) {
        console.warn('[CMS] Unknown department section:', sectionName);
        return;
    }

    // Find the section by aria-label
    const section = document.querySelector(`section[aria-label="${ariaLabel}"]`);

    if (!section) {
        console.warn('[CMS] Could not find section with aria-label:', ariaLabel);
        return;
    }

    // Update the image if content has an image property
    if (content.image) {
        const img = section.querySelector('.ministry-image img');
        if (img) {
            const imagePath = content.image.startsWith('/') ? content.image.substring(1) : content.image;
            const imgSrc = content.image.startsWith('http') ? content.image : `${API_BASE_URL}/${imagePath}`;
            img.src = imgSrc;
            console.log('[CMS] Updated department image for', ariaLabel, ':', imgSrc);
        } else {
            console.warn('[CMS] Could not find img element in section:', ariaLabel);
        }
    }

    // Update title if provided
    if (content.title) {
        const heading = section.querySelector('h2');
        if (heading) {
            heading.textContent = content.title;
        }
    }

    // Update description if provided
    if (content.description) {
        const paragraph = section.querySelector('p');
        if (paragraph) {
            paragraph.textContent = content.description;
        }
    }
}

/**
 * Update media page content (YouTube channels and recent services)
 */
function updateMediaPage(content, sectionName) {
    console.log('[CMS] Updating media page section:', sectionName);

    if (sectionName === 'youtube-channels' && content.channels) {
        // Update YouTube channel cards
        const channelCards = document.querySelectorAll('.youtube-channel-card');
        content.channels.forEach((channel, idx) => {
            if (channelCards[idx]) {
                const card = channelCards[idx];

                // Update channel name
                if (channel.name) {
                    const nameElement = card.querySelector('h3');
                    if (nameElement) nameElement.textContent = channel.name;
                }

                // Update description
                if (channel.description) {
                    const descElement = card.querySelector('p');
                    if (descElement) descElement.textContent = channel.description;
                }

                // Update URL
                if (channel.url) {
                    const linkElement = card.querySelector('a');
                    if (linkElement) linkElement.href = channel.url;
                }

                console.log('[CMS] Updated YouTube channel', idx + 1);
            }
        });
    }

    if (sectionName === 'recent-services' && content.services) {
        // Update Portsmouth services
        if (content.services.portsmouth || content.services.Portsmouth) {
            const portsmouthServices = content.services.portsmouth || content.services.Portsmouth;
            updateServiceVideos(portsmouthServices, 0);
        }

        // Update Banks services
        if (content.services.banks || content.services.Banks) {
            const banksServices = content.services.banks || content.services.Banks;
            const portsmouthCount = (content.services.portsmouth || content.services.Portsmouth || []).length;
            updateServiceVideos(banksServices, portsmouthCount);
        }
    }

    if (sectionName === 'weekly-schedule' && content.schedule) {
        // Update weekly schedule
        updateWeeklySchedule(content);
    }

    // Update title if provided
    if (content.title) {
        const section = document.querySelector(`section[aria-label="${sectionName}"]`);
        if (section) {
            const heading = section.querySelector('h2');
            if (heading) heading.textContent = content.title;
        }
    }

    // Update intro if provided
    if (content.intro) {
        const section = document.querySelector(`section[aria-label="${sectionName}"]`);
        if (section) {
            const intro = section.querySelector('.schedule-intro');
            if (intro) intro.textContent = content.intro;
        }
    }
}

/**
 * Helper function to update service video cards
 */
function updateServiceVideos(services, startIndex) {
    const serviceCards = document.querySelectorAll('.service-video-card');

    services.forEach((service, idx) => {
        const cardIndex = startIndex + idx;
        if (serviceCards[cardIndex]) {
            const card = serviceCards[cardIndex];

            // Update iframe src
            if (service.embedUrl) {
                const iframe = card.querySelector('iframe');
                if (iframe) {
                    iframe.src = service.embedUrl;
                    console.log('[CMS] Updated service video', cardIndex + 1, ':', service.embedUrl);
                }
            }

            // Update title
            if (service.title) {
                const titleElement = card.querySelector('h4');
                if (titleElement) titleElement.textContent = service.title;
            }

            // Update date
            if (service.date) {
                const dateElement = card.querySelector('p:first-of-type');
                if (dateElement) {
                    dateElement.innerHTML = `<i class="far fa-calendar"></i> ${service.date}`;
                }
            }

            // Update location
            if (service.location) {
                const locationElement = card.querySelector('.service-location');
                if (locationElement) {
                    locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${service.location}`;
                }
            }
        }
    });
}

/**
 * Helper function to update weekly schedule
 */
function updateWeeklySchedule(content) {
    console.log('[CMS] Updating weekly schedule');

    if (!content.schedule || !Array.isArray(content.schedule)) {
        console.warn('[CMS] No schedule array found in content');
        return;
    }

    const scheduleCards = document.querySelectorAll('.schedule-card');

    content.schedule.forEach((daySchedule, idx) => {
        if (scheduleCards[idx]) {
            const card = scheduleCards[idx];

            // Update day name
            if (daySchedule.day) {
                const dayHeading = card.querySelector('.schedule-day h3');
                if (dayHeading) {
                    dayHeading.textContent = daySchedule.day;
                    console.log('[CMS] Updated schedule day', idx + 1, ':', daySchedule.day);
                }
            }

            // Update events for this day
            if (daySchedule.events && Array.isArray(daySchedule.events)) {
                const eventsContainer = card.querySelector('.schedule-events');
                if (eventsContainer) {
                    eventsContainer.innerHTML = daySchedule.events.map(event => {
                        return `
                            <div class="schedule-event">
                                <span class="event-time">${event.time || ''}</span>
                                <span class="event-name">${event.name || ''}</span>
                            </div>
                        `;
                    }).join('');
                    console.log('[CMS] Updated', daySchedule.events.length, 'events for', daySchedule.day);
                }
            }
        }
    });
}

/**
 * Helper function to update FAQ section
 */
function updateFAQSection(content) {
    console.log('[CMS] Updating FAQ section');

    if (!content.questions || !Array.isArray(content.questions)) {
        console.warn('[CMS] No questions array found in FAQ content');
        return;
    }

    const accordionContainer = document.querySelector('.faq-section .accordion');

    if (!accordionContainer) {
        console.warn('[CMS] Could not find FAQ accordion container');
        return;
    }

    // Update FAQ title if provided
    if (content.title) {
        const faqTitle = document.querySelector('.faq-section h2');
        if (faqTitle) {
            faqTitle.textContent = content.title;
        }
    }

    // Rebuild the accordion with CMS questions
    accordionContainer.innerHTML = content.questions.map(qa => {
        return `
            <div class="accordion-item">
                <button class="accordion-header" type="button">
                    <span>${qa.question}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="accordion-content">
                    <p>${qa.answer}</p>
                </div>
            </div>
        `;
    }).join('');

    console.log('[CMS] Updated', content.questions.length, 'FAQ items');
}

/**
 * Helper function to update What To Expect section
 */
function updateWhatToExpect(content) {
    console.log('[CMS] Updating What To Expect section');

    if (!content.cards || !Array.isArray(content.cards)) {
        console.warn('[CMS] No cards array found in What To Expect content');
        return;
    }

    const expectCards = document.querySelectorAll('#expectCarousel .expect-card');

    content.cards.forEach((card, idx) => {
        // Update both sets of cards (original and duplicates for infinite scroll)
        [idx, idx + content.cards.length].forEach(cardIdx => {
            if (expectCards[cardIdx]) {
                const expectCard = expectCards[cardIdx];

                // Update image
                if (card.image) {
                    const img = expectCard.querySelector('.expect-image img');
                    if (img) {
                        const imagePath = card.image.startsWith('/') ? card.image.substring(1) : card.image;
                        const imgSrc = card.image.startsWith('http') ? card.image : `${API_BASE_URL}/${imagePath}`;
                        img.src = imgSrc;
                        img.alt = card.title || 'Expect image';
                    }
                }

                // Update title
                if (card.title) {
                    const title = expectCard.querySelector('.expect-content h3');
                    if (title) title.textContent = card.title;
                }

                // Update description
                if (card.description) {
                    const description = expectCard.querySelector('.expect-content p');
                    if (description) description.textContent = card.description;
                }
            }
        });
    });

    console.log('[CMS] Updated', content.cards.length, 'What To Expect cards');
}

/**
 * Update Contact page generic sections (hero, locations, etc.)
 */
function updateContactPage(content, sectionName) {
    console.log('[CMS] Updating contact page section:', sectionName);

    // Update hero section if it's the hero
    if (sectionName === 'hero') {
        if (content.title) {
            const heroTitle = document.querySelector('.contact-hero h1, .page-hero h1');
            if (heroTitle) heroTitle.textContent = content.title;
        }

        if (content.subtitle) {
            const heroSubtitle = document.querySelector('.contact-hero p, .page-hero p');
            if (heroSubtitle) heroSubtitle.textContent = content.subtitle;
        }
    }

    // Update locations section
    if (sectionName === 'locations' && content.locations) {
        const locationCards = document.querySelectorAll('.location-card');
        content.locations.forEach((location, idx) => {
            if (locationCards[idx]) {
                const card = locationCards[idx];

                if (location.name) {
                    const nameEl = card.querySelector('h3');
                    if (nameEl) nameEl.textContent = location.name;
                }

                if (location.address) {
                    const addressEl = card.querySelector('.address');
                    if (addressEl) addressEl.textContent = location.address;
                }

                if (location.phone) {
                    const phoneEl = card.querySelector('.phone');
                    if (phoneEl) phoneEl.textContent = location.phone;
                }

                if (location.email) {
                    const emailEl = card.querySelector('.email');
                    if (emailEl) emailEl.textContent = location.email;
                }
            }
        });
        console.log('[CMS] Updated', content.locations.length, 'location cards');
    }

    // Fallback to generic image updates for other sections
    updateGenericImages(content, sectionName);
}

/**
 * Generic image updater for any page
 * Recursively searches content for image properties and updates them
 */
function updateGenericImages(content, sectionName) {
    console.log('[CMS] Generic image update for section:', sectionName);

    // Helper function to update image URL
    function getImageUrl(src) {
        if (!src) return src;
        const imagePath = src.startsWith('/') ? src.substring(1) : src;
        return src.startsWith('http') ? src : `${API_BASE_URL}/${imagePath}`;
    }

    // Helper function to find and update image elements recursively
    function updateImagesInObject(obj, path = '') {
        if (!obj || typeof obj !== 'object') return;

        // Handle arrays
        if (Array.isArray(obj)) {
            obj.forEach((item, idx) => {
                updateImagesInObject(item, `${path}[${idx}]`);
            });
            return;
        }

        // Handle objects
        for (const key in obj) {
            const value = obj[key];

            // Check if this looks like an image property
            if (key === 'image' || key === 'src' || key === 'backgroundImage' ||
                key.toLowerCase().includes('image') || key.toLowerCase().includes('img')) {

                if (typeof value === 'string' && value.length > 0) {
                    const imageUrl = getImageUrl(value);
                    console.log(`[CMS] Found image at ${path}.${key}:`, imageUrl);

                    // Try to find and update corresponding DOM element
                    // This is a best-effort approach - specific implementations may need custom selectors
                    const selectors = [
                        `[data-section="${sectionName}"] img`,
                        `.${sectionName} img`,
                        `#${sectionName} img`,
                        `.${key} img`,
                        `[data-image="${key}"] img`
                    ];

                    for (const selector of selectors) {
                        const elements = document.querySelectorAll(selector);
                        if (elements.length > 0) {
                            elements.forEach(el => {
                                el.src = imageUrl;
                                console.log('[CMS] Updated image with selector:', selector);
                            });
                            break;
                        }
                    }
                }
            } else if (typeof value === 'object') {
                updateImagesInObject(value, `${path}.${key}`);
            }
        }
    }

    updateImagesInObject(content);
}
