/**
 * CMS Content Loader
 * Dynamically loads images from the CMS API and updates the page
 */

// CMS Backend URL - change this to your production URL when deploying
const API_BASE_URL = 'https://hta-kwfr.onrender.com';

(async function loadCMSImages() {
    try {
        // Detect current page from the URL
        const path = window.location.pathname;
        const pageName = path.substring(path.lastIndexOf('/') + 1).replace('.html', '') || 'index';
        const page = pageName === 'index' ? 'home' : pageName;

        console.log('[CMS] Loading images for page:', page);

        // Fetch content from CMS - use Render backend URL
        const API_BASE_URL = 'https://hta-kwfr.onrender.com';
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
                updateHeroGallery(sectionContent);
            } else if (sectionName === 'event-flyers' || sectionName === 'events') {
                updateEventCarousel(sectionContent);
            } else if (sectionName === 'footer') {
                updateFooter(sectionContent);
            } else {
                // Use generic updaters for unhandled sections
                updateGenericImages(sectionContent, sectionName);
            }
            break;
        case 'about':
            if (sectionName === 'our-history') {
                updateHistoryImages(sectionContent);
            } else if (sectionName === 'our-team') {
                updateTeamImages(sectionContent);
            } else if (sectionName === 'who-we-are') {
                updateWhoWeAre(sectionContent);
            } else if (sectionName === 'what-we-believe') {
                updateWhatWeBelieve(sectionContent);
            } else if (sectionName === 'our-officers') {
                updateOurOfficers(sectionContent);
            } else if (sectionName === 'footer') {
                updateFooter(sectionContent);
            } else {
                // Use generic updaters for unhandled sections
                updateGenericImages(sectionContent, sectionName);
            }
            break;
        case 'events':
            if (sectionName === 'footer') {
                updateFooter(sectionContent);
            } else {
                updateGenericImages(sectionContent, sectionName);
            }
            break;
        case 'give':
            if (sectionName === 'give-content') {
                updateGivePage(sectionContent);
            } else if (sectionName === 'footer') {
                updateFooter(sectionContent);
            } else {
                updateGenericImages(sectionContent, sectionName);
            }
            break;
        case 'media':
            if (sectionName === 'footer') {
                updateFooter(sectionContent);
            } else {
                updateMediaPage(sectionContent, sectionName);
            }
            break;
        case 'departments':
            if (sectionName === 'footer') {
                updateFooter(sectionContent);
            } else {
                updateDepartmentImages(sectionContent, sectionName);
            }
            break;
        case 'contact':
            if (sectionName === 'faq') {
                updateFAQSection(sectionContent);
            } else if (sectionName === 'what-to-expect') {
                updateWhatToExpect(sectionContent);
            } else if (sectionName === 'service-info') {
                updateServiceInfo(sectionContent);
            } else if (sectionName === 'footer') {
                updateFooter(sectionContent);
            } else {
                updateContactPage(sectionContent, sectionName);
            }
            break;
        default:
            // Check for footer on any page
            if (sectionName === 'footer') {
                updateFooter(sectionContent);
            } else {
                // For any other page, try generic image updates
                updateGenericImages(sectionContent, sectionName);
            }
    }
}

/**
 * Update hero gallery on home page
 */
function updateHeroGallery(content) {
    // Update hero text content
    if (content.title) {
        const heroTitle = document.querySelector('.hero-video-content h1');
        if (heroTitle) {
            heroTitle.textContent = content.title;
            console.log('[CMS] Updated hero title:', content.title);
        }
    }

    if (content.subtitle) {
        const heroSubtitle = document.querySelector('.hero-video-content p');
        if (heroSubtitle) {
            heroSubtitle.textContent = content.subtitle;
            console.log('[CMS] Updated hero subtitle:', content.subtitle);
        }
    }

    if (!content.galleryImages) {
        console.log('[CMS] No gallery images in CMS, keeping hardcoded images');
        return;
    }

    const heroGallery = document.getElementById('heroGallery');
    if (!heroGallery) return;

    // Validate that we have valid images
    const validImages = content.galleryImages.filter(img => {
        return img && img.src && img.src.trim() !== '' &&
               !img.src.includes('undefined') &&
               !img.src.includes('null');
    });

    // Only update if we have at least 10 valid images (to ensure good coverage)
    if (validImages.length >= 10) {
        console.log('[CMS] Updating hero gallery with', validImages.length, 'images');

        heroGallery.innerHTML = validImages.map(img => {
            let imgSrc;
            if (img.src.startsWith('http')) {
                // External URL - use as is
                imgSrc = img.src;
            } else if (img.src.startsWith('/uploads/') || img.src.startsWith('uploads/')) {
                // CMS uploaded image - use backend URL
                const imagePath = img.src.startsWith('/') ? img.src.substring(1) : img.src;
                imgSrc = `${API_BASE_URL}/${imagePath}`;
            } else {
                // Local static asset (assets/) - use relative path
                imgSrc = img.src;
            }
            const className = img.class ? `gallery-cell ${img.class}` : 'gallery-cell';
            return `<div class="${className}" style="background-image: url('${imgSrc}');"></div>`;
        }).join('');

        console.log('[CMS] Hero gallery updated!');
    } else {
        console.log('[CMS] Not enough valid images in CMS (' + validImages.length + '), keeping hardcoded images');
    }

    // Update vision carousel
    const visionCarousel = document.getElementById('visionCarousel');
    if (visionCarousel && content.galleryImages) {
        const visionImages = content.galleryImages.slice(0, 10);
        visionCarousel.innerHTML = visionImages.map((img, idx) => {
            let imgSrc;
            if (img.src.startsWith('http')) {
                // External URL - use as is
                imgSrc = img.src;
            } else if (img.src.startsWith('/uploads/') || img.src.startsWith('uploads/')) {
                // CMS uploaded image - use backend URL
                const imagePath = img.src.startsWith('/') ? img.src.substring(1) : img.src;
                imgSrc = `${API_BASE_URL}/${imagePath}`;
            } else {
                // Local static asset (assets/) - use relative path
                imgSrc = img.src;
            }
            const alt = img.alt || `Gallery image ${idx + 1}`;
            return `<div class="gallery-item"><img src="${imgSrc}" alt="${alt}" loading="lazy"></div>`;
        }).join('');
    }
}

/**
 * Update history images on about page
 */
function updateHistoryImages(content) {
    console.log('[CMS] Updating history section');

    const section = document.querySelector('#our-story');
    if (!section) {
        console.warn('[CMS] History section not found');
        return;
    }

    // Update section label
    if (content.label) {
        const label = section.querySelector('.section-label');
        if (label) {
            label.textContent = content.label;
            console.log('[CMS] Updated history label:', content.label);
        }
    }

    // Update main heading
    if (content.heading || content.title) {
        const heading = section.querySelector('h2');
        if (heading) {
            heading.textContent = content.heading || content.title;
            console.log('[CMS] Updated history heading');
        }
    }

    // Update main history paragraphs
    if (content.paragraph1 || content.text1) {
        const paragraphs = section.querySelectorAll('.story-content > p:not(.mission-quote)');
        if (paragraphs[0]) {
            paragraphs[0].textContent = content.paragraph1 || content.text1;
            console.log('[CMS] Updated history paragraph 1');
        }
    }

    if (content.paragraph2 || content.text2) {
        const paragraphs = section.querySelectorAll('.story-content > p:not(.mission-quote)');
        if (paragraphs[1]) {
            paragraphs[1].textContent = content.paragraph2 || content.text2;
            console.log('[CMS] Updated history paragraph 2');
        }
    }

    // Update mission quote
    if (content.quote) {
        const quote = section.querySelector('.mission-quote em');
        if (quote) {
            quote.textContent = content.quote;
            console.log('[CMS] Updated mission quote');
        }
    }

    // Update founder image (Bishop Carter)
    if (content.founderImage) {
        const founderImg = document.querySelector('.story-image img');
        if (founderImg) {
            const imagePath = content.founderImage.src.startsWith('/') ? content.founderImage.src.substring(1) : content.founderImage.src;
            const imgSrc = content.founderImage.src.startsWith('http') ? content.founderImage.src : `${API_BASE_URL}/${imagePath}`;
            founderImg.src = imgSrc;
            console.log('[CMS] Updated founder image:', imgSrc);
        }
    }

    // Update founder caption
    if (content.founderCaption) {
        const caption = section.querySelector('.story-image .image-caption');
        if (caption) {
            caption.innerHTML = content.founderCaption;
            console.log('[CMS] Updated founder caption');
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

    // Update history image captions
    if (content.historyCaptions && content.historyCaptions.length > 0) {
        const captions = document.querySelectorAll('.history-image-item .image-caption');
        content.historyCaptions.forEach((caption, idx) => {
            if (captions[idx]) {
                captions[idx].innerHTML = caption;
                console.log('[CMS] Updated history caption', idx + 1);
            }
        });
    }

    // Also update text content using generic updater
    updateGenericText(content, 'our-history');
}

/**
 * Update team images on about page
 */
function updateTeamImages(content) {
    if (!content.staff) return;

    console.log('[CMS] Updating team images and info');

    content.staff.forEach((member, idx) => {
        const staffCard = document.querySelector(`.staff-card:nth-child(${idx + 1})`);

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
                const nameEl = staffCard.querySelector('h3');
                if (nameEl) {
                    nameEl.textContent = member.name;
                    console.log('[CMS] Updated team member name', idx + 1, ':', member.name);
                }
            }

            // Update title/role
            if (member.title || member.role) {
                const titleEl = staffCard.querySelector('.staff-title, .role');
                if (titleEl) {
                    titleEl.textContent = member.title || member.role;
                    console.log('[CMS] Updated team member title', idx + 1, ':', member.title || member.role);
                }
            }

            // Update location
            if (member.location) {
                const locationEl = staffCard.querySelector('.staff-location, .location');
                if (locationEl) {
                    locationEl.textContent = member.location;
                    console.log('[CMS] Updated team member location', idx + 1, ':', member.location);
                }
            }
        } else {
            console.warn('[CMS] Could not find staff card for member', idx + 1);
        }
    });

    // Also update any other text content using generic updater
    updateGenericText(content, 'our-team');
}

/**
 * Update Who We Are section on about page
 */
function updateWhoWeAre(content) {
    console.log('[CMS] Updating Who We Are section');

    const section = document.querySelector('#who-we-are');
    if (!section) {
        console.warn('[CMS] Who We Are section not found');
        return;
    }

    // Update section label
    if (content.label) {
        const label = section.querySelector('.section-label');
        if (label) {
            label.textContent = content.label;
            console.log('[CMS] Updated Who We Are label:', content.label);
        }
    }

    // Update main heading
    if (content.heading || content.title) {
        const heading = section.querySelector('h2');
        if (heading) {
            heading.innerHTML = content.heading || content.title;
            console.log('[CMS] Updated Who We Are heading');
        }
    }

    // Update lead text
    if (content.leadText || content.description) {
        const leadText = section.querySelector('.lead-text');
        if (leadText) {
            leadText.textContent = content.leadText || content.description;
            console.log('[CMS] Updated Who We Are lead text');
        }
    }

    // Update Vision card
    if (content.vision) {
        const visionCard = section.querySelector('.vm-card:nth-child(1)');
        if (visionCard) {
            const visionText = visionCard.querySelector('p');
            if (visionText) {
                visionText.textContent = content.vision;
                console.log('[CMS] Updated vision text');
            }
        }
    }

    // Update Mission card
    if (content.mission) {
        const missionCard = section.querySelector('.vm-card:nth-child(2)');
        if (missionCard) {
            const missionText = missionCard.querySelector('p');
            if (missionText) {
                missionText.textContent = content.mission;
                console.log('[CMS] Updated mission text');
            }
        }
    }

    // Use generic updater for any other fields
    updateGenericText(content, 'who-we-are');
}

/**
 * Update What We Believe section on about page
 */
function updateWhatWeBelieve(content) {
    console.log('[CMS] Updating What We Believe section');

    const section = document.querySelector('#what-we-believe');
    if (!section) {
        console.warn('[CMS] What We Believe section not found');
        return;
    }

    // Update main heading
    if (content.title || content.heading) {
        const heading = section.querySelector('h2');
        if (heading) {
            heading.textContent = content.title || content.heading;
            console.log('[CMS] Updated What We Believe heading');
        }
    }

    // Update intro paragraphs
    if (content.intro1) {
        const intros = section.querySelectorAll('.belief-intro');
        if (intros[0]) {
            intros[0].textContent = content.intro1;
            console.log('[CMS] Updated What We Believe intro 1');
        }
    }

    if (content.intro2) {
        const intros = section.querySelectorAll('.belief-intro');
        if (intros[1]) {
            intros[1].innerHTML = content.intro2; // Using innerHTML to preserve <em> tags if present
            console.log('[CMS] Updated What We Believe intro 2');
        }
    }

    // Update accordion items if provided
    if (content.articles && Array.isArray(content.articles)) {
        content.articles.forEach((article, idx) => {
            const accordionItem = section.querySelector(`.accordion-item:nth-child(${idx + 1})`);
            if (accordionItem && article.title) {
                const titleSpan = accordionItem.querySelector('.accordion-header span');
                if (titleSpan) {
                    titleSpan.textContent = article.title;
                    console.log(`[CMS] Updated accordion article ${idx + 1} title`);
                }
            }
            if (accordionItem && article.content) {
                const contentDiv = accordionItem.querySelector('.accordion-content');
                if (contentDiv) {
                    contentDiv.innerHTML = article.content;
                    console.log(`[CMS] Updated accordion article ${idx + 1} content`);
                }
            }
        });
    }

    // Use generic updater for any other fields
    updateGenericText(content, 'what-we-believe');
}

/**
 * Update Our Officers section on about page
 */
function updateOurOfficers(content) {
    console.log('[CMS] Updating Our Officers section');

    const section = document.querySelector('#our-officers');
    if (!section) {
        console.warn('[CMS] Our Officers section not found');
        return;
    }

    // Update main heading
    if (content.title || content.heading) {
        const heading = section.querySelector('h2');
        if (heading) {
            heading.textContent = content.title || content.heading;
            console.log('[CMS] Updated Our Officers heading');
        }
    }

    // Update description
    if (content.description || content.text) {
        const description = section.querySelector('.officers-description p');
        if (description) {
            description.textContent = content.description || content.text;
            console.log('[CMS] Updated Our Officers description');
        }
    }

    // Update image if provided
    if (content.image) {
        const img = section.querySelector('.officers-image img');
        if (img) {
            const imagePath = content.image.startsWith('/') ? content.image.substring(1) : content.image;
            const imgSrc = content.image.startsWith('http') ? content.image : `${API_BASE_URL}/${imagePath}`;
            img.src = imgSrc;

            // Also update lightbox image
            const lightboxImg = document.querySelector('#officersLightbox .lightbox-content');
            if (lightboxImg) {
                lightboxImg.src = imgSrc;
            }

            console.log('[CMS] Updated Our Officers image:', imgSrc);
        }
    }

    // Use generic updater for any other fields
    updateGenericText(content, 'our-officers');
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
 * Update event carousel flyers on home page
 */
function updateEventCarousel(content) {
    console.log('[CMS] Updating event carousel flyers');

    if (!content.flyers || !Array.isArray(content.flyers)) {
        console.warn('[CMS] No flyers array found in event content');
        return;
    }

    const carouselTrack = document.querySelector('#eventCarousel .carousel-track');
    if (!carouselTrack) {
        console.warn('[CMS] Could not find event carousel track');
        return;
    }

    // Build carousel items from CMS flyers
    carouselTrack.innerHTML = content.flyers.map(flyer => {
        const imagePath = flyer.image.startsWith('/') ? flyer.image.substring(1) : flyer.image;
        const imgSrc = flyer.image.startsWith('http') ? flyer.image : `${API_BASE_URL}/${imagePath}`;
        const alt = flyer.alt || flyer.title || 'Event Flyer';

        return `
            <div class="carousel-item event-poster-card">
                <img src="${imgSrc}" alt="${alt}" loading="lazy">
            </div>
        `;
    }).join('');

    console.log('[CMS] Updated event carousel with', content.flyers.length, 'flyers');

    // Dispatch event to reinitialize carousel
    document.dispatchEvent(new Event('carouselContentUpdated'));
}

/**
 * Update footer content on all pages
 */
function updateFooter(content) {
    console.log('[CMS] Updating footer content');

    // Update contact email
    if (content.email) {
        const emailLinks = document.querySelectorAll('footer a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.href = `mailto:${content.email}`;
            link.textContent = content.email;
        });
        console.log('[CMS] Updated footer email:', content.email);
    }

    // Update phone number
    if (content.phone) {
        const phoneLinks = document.querySelectorAll('footer a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.href = `tel:${content.phone}`;
            link.textContent = content.phone;
        });
        console.log('[CMS] Updated footer phone:', content.phone);
    }

    // Update address
    if (content.address) {
        const addressElements = document.querySelectorAll('footer .footer-address, footer address');
        addressElements.forEach(el => {
            el.textContent = content.address;
        });
        console.log('[CMS] Updated footer address');
    }

    // Update social links
    if (content.socialLinks) {
        if (content.socialLinks.facebook) {
            const fbLinks = document.querySelectorAll('footer a[href*="facebook"]');
            fbLinks.forEach(link => link.href = content.socialLinks.facebook);
        }
        if (content.socialLinks.instagram) {
            const igLinks = document.querySelectorAll('footer a[href*="instagram"]');
            igLinks.forEach(link => link.href = content.socialLinks.instagram);
        }
        if (content.socialLinks.youtube) {
            const ytLinks = document.querySelectorAll('footer a[href*="youtube"]');
            ytLinks.forEach(link => link.href = content.socialLinks.youtube);
        }
        console.log('[CMS] Updated footer social links');
    }

    // Update copyright year and text
    if (content.copyright) {
        const copyrightElements = document.querySelectorAll('footer .copyright, footer .footer-bottom p');
        copyrightElements.forEach(el => {
            el.innerHTML = content.copyright;
        });
        console.log('[CMS] Updated footer copyright');
    }
}

/**
 * Update service times and addresses on contact page
 */
function updateServiceInfo(content) {
    console.log('[CMS] Updating service times and addresses');

    // Update Portsmouth branch info
    if (content.portsmouth) {
        const portsmouthSection = document.querySelector('[data-branch="portsmouth"]') ||
                                 document.querySelector('.branch-info:first-child');

        if (portsmouthSection) {
            // Update address
            if (content.portsmouth.address) {
                const addressEl = portsmouthSection.querySelector('.branch-address, address');
                if (addressEl) {
                    addressEl.textContent = content.portsmouth.address;
                }
            }

            // Update service times
            if (content.portsmouth.serviceTimes && Array.isArray(content.portsmouth.serviceTimes)) {
                const timesContainer = portsmouthSection.querySelector('.service-times, .times-list');
                if (timesContainer) {
                    timesContainer.innerHTML = content.portsmouth.serviceTimes.map(time => {
                        return `<div class="service-time">${time}</div>`;
                    }).join('');
                }
            }

            console.log('[CMS] Updated Portsmouth service info');
        }
    }

    // Update Banks branch info
    if (content.banks) {
        const banksSection = document.querySelector('[data-branch="banks"]') ||
                            document.querySelector('.branch-info:last-child');

        if (banksSection) {
            // Update address
            if (content.banks.address) {
                const addressEl = banksSection.querySelector('.branch-address, address');
                if (addressEl) {
                    addressEl.textContent = content.banks.address;
                }
            }

            // Update service times
            if (content.banks.serviceTimes && Array.isArray(content.banks.serviceTimes)) {
                const timesContainer = banksSection.querySelector('.service-times, .times-list');
                if (timesContainer) {
                    timesContainer.innerHTML = content.banks.serviceTimes.map(time => {
                        return `<div class="service-time">${time}</div>`;
                    }).join('');
                }
            }

            console.log('[CMS] Updated Banks service info');
        }
    }

    // Update general service times (if not branch-specific)
    if (content.serviceTimes && Array.isArray(content.serviceTimes)) {
        const generalTimesContainer = document.querySelector('.general-service-times');
        if (generalTimesContainer) {
            generalTimesContainer.innerHTML = content.serviceTimes.map(service => {
                return `
                    <div class="service-time-item">
                        <strong>${service.day}</strong>: ${service.time}
                    </div>
                `;
            }).join('');
            console.log('[CMS] Updated general service times');
        }
    }
}

/**
 * Update give page specific content
 */
function updateGivePage(content) {
    console.log('[CMS] Updating give page content');

    // Update page title/heading
    if (content.title) {
        const pageTitle = document.querySelector('.give-section h1, .give-section .section-title');
        if (pageTitle) {
            pageTitle.textContent = content.title;
        }
    }

    // Update intro text
    if (content.intro) {
        const introText = document.querySelector('.give-intro, .give-section .intro-text');
        if (introText) {
            introText.textContent = content.intro;
        }
    }

    // Update giving options
    if (content.givingOptions && Array.isArray(content.givingOptions)) {
        const optionsContainer = document.querySelector('.giving-options, .give-methods');
        if (optionsContainer) {
            optionsContainer.innerHTML = content.givingOptions.map(option => {
                const iconClass = option.icon || 'fas fa-hand-holding-heart';
                return `
                    <div class="giving-option">
                        <div class="option-icon">
                            <i class="${iconClass}"></i>
                        </div>
                        <h3>${option.title}</h3>
                        <p>${option.description}</p>
                        ${option.link ? `<a href="${option.link}" class="btn btn-primary">${option.linkText || 'Give Now'}</a>` : ''}
                    </div>
                `;
            }).join('');
            console.log('[CMS] Updated', content.givingOptions.length, 'giving options');
        }
    }

    // Update payment details (for checks, wire transfers, etc.)
    if (content.paymentDetails) {
        const detailsContainer = document.querySelector('.payment-details');
        if (detailsContainer) {
            let detailsHTML = '<h3>Payment Details</h3>';

            if (content.paymentDetails.checkPayableTo) {
                detailsHTML += `<p><strong>Checks payable to:</strong> ${content.paymentDetails.checkPayableTo}</p>`;
            }
            if (content.paymentDetails.mailingAddress) {
                detailsHTML += `<p><strong>Mailing Address:</strong><br>${content.paymentDetails.mailingAddress}</p>`;
            }
            if (content.paymentDetails.bankInfo) {
                detailsHTML += `<p><strong>Bank Information:</strong><br>${content.paymentDetails.bankInfo}</p>`;
            }

            detailsContainer.innerHTML = detailsHTML;
            console.log('[CMS] Updated payment details');
        }
    }

    // Update images
    if (content.images && Array.isArray(content.images)) {
        content.images.forEach((img, idx) => {
            const imgElement = document.querySelector(`.give-section img:nth-of-type(${idx + 1})`);
            if (imgElement && img.src) {
                const imagePath = img.src.startsWith('/') ? img.src.substring(1) : img.src;
                const imgSrc = img.src.startsWith('http') ? img.src : `${API_BASE_URL}/${imagePath}`;
                imgElement.src = imgSrc;
                if (img.alt) imgElement.alt = img.alt;
            }
        });
        console.log('[CMS] Updated give page images');
    }

    // Update Bible verse or inspirational quote
    if (content.verse) {
        const verseContainer = document.querySelector('.giving-verse, .scripture-quote');
        if (verseContainer) {
            verseContainer.innerHTML = `
                <blockquote>
                    <p>${content.verse.text}</p>
                    <cite>${content.verse.reference}</cite>
                </blockquote>
            `;
            console.log('[CMS] Updated giving verse');
        }
    }
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

    // Also update text content generically
    updateGenericText(content, sectionName);
}

/**
 * Generic text content updater for any section
 * Updates text fields like title, description, etc.
 */
function updateGenericText(content, sectionName) {
    console.log('[CMS] Generic text update for section:', sectionName);

    // Skip if content is not an object
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
        return;
    }

    // Map of common text field names to their likely HTML selectors
    const textFieldMappings = {
        'title': ['h1', 'h2', 'h3', '.title', '.section-title', '.page-title'],
        'subtitle': ['h2', 'h3', 'h4', 'p', '.subtitle', '.section-subtitle'],
        'heading': ['h1', 'h2', 'h3', '.heading'],
        'description': ['p', '.description', '.text', '.content-text'],
        'text': ['p', '.text', '.content', '.description'],
        'content': ['.content', '.text-content', 'p'],
        'intro': ['.intro', '.intro-text', 'p'],
        'label': ['.label', 'span', '.section-label']
    };

    // Try to find the section container first
    const sectionSelectors = [
        `section[aria-label*="${sectionName}"]`,
        `#${sectionName}`,
        `.${sectionName}`,
        `[data-section="${sectionName}"]`,
        `section.${sectionName}-section`
    ];

    let sectionContainer = null;
    for (const selector of sectionSelectors) {
        sectionContainer = document.querySelector(selector);
        if (sectionContainer) {
            console.log('[CMS] Found section container with selector:', selector);
            break;
        }
    }

    // Update each text field in the content
    for (const [fieldName, fieldValue] of Object.entries(content)) {
        // Skip non-text fields
        if (typeof fieldValue !== 'string' || fieldValue.trim() === '') continue;
        if (fieldName.toLowerCase().includes('image') ||
            fieldName.toLowerCase().includes('img') ||
            fieldName.toLowerCase().includes('src') ||
            fieldName.toLowerCase().includes('url')) continue;

        const selectors = textFieldMappings[fieldName.toLowerCase()] || [];

        // Try to update within section container first
        if (sectionContainer) {
            for (const selector of selectors) {
                const element = sectionContainer.querySelector(selector);
                if (element) {
                    element.textContent = fieldValue;
                    console.log(`[CMS] Updated ${fieldName} in section ${sectionName}:`, fieldValue.substring(0, 50));
                    break;
                }
            }
        }

        // Also try data attributes
        const dataElement = document.querySelector(`[data-cms-field="${fieldName}"]`) ||
                           document.querySelector(`[data-field="${fieldName}"]`);
        if (dataElement) {
            dataElement.textContent = fieldValue;
            console.log(`[CMS] Updated ${fieldName} via data attribute:`, fieldValue.substring(0, 50));
        }
    }
}
