/**
 * CMS Content Loader
 * Dynamically loads images from the CMS API and updates the page
 */

(async function loadCMSImages() {
    try {
        // Detect current page from the URL
        const path = window.location.pathname;
        const pageName = path.substring(path.lastIndexOf('/') + 1).replace('.html', '') || 'index';
        const page = pageName === 'index' ? 'home' : pageName;

        console.log('[CMS] Loading images for page:', page);

        // Fetch content from CMS
        const response = await fetch(`http://localhost:5001/api/content/${page}`);
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
            }
            break;
        case 'about':
            if (sectionName === 'our-history') {
                updateHistoryImages(sectionContent);
            } else if (sectionName === 'our-team') {
                updateTeamImages(sectionContent);
            }
            break;
        case 'events':
            updateGenericImages(sectionContent, sectionName);
            break;
        case 'give':
            updateGenericImages(sectionContent, sectionName);
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
 * Update hero gallery on home page
 */
function updateHeroGallery(content) {
    if (!content.galleryImages) return;

    const heroGallery = document.getElementById('heroGallery');
    if (heroGallery && content.galleryImages.length > 0) {
        console.log('[CMS] Updating hero gallery with', content.galleryImages.length, 'images');

        heroGallery.innerHTML = content.galleryImages.map(img => {
            const imagePath = img.src.startsWith('/') ? img.src.substring(1) : img.src;
            const imgSrc = img.src.startsWith('http') ? img.src : `http://localhost:5001/${imagePath}`;
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
            const imgSrc = img.src.startsWith('http') ? img.src : `http://localhost:5001/${imagePath}`;
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

    // Update founder image (Bishop Carter)
    if (content.founderImage) {
        const founderImg = document.querySelector('.story-image img');
        if (founderImg) {
            const imagePath = content.founderImage.src.startsWith('/') ? content.founderImage.src.substring(1) : content.founderImage.src;
            const imgSrc = content.founderImage.src.startsWith('http') ? content.founderImage.src : `http://localhost:5001/${imagePath}`;
            founderImg.src = imgSrc;
            console.log('[CMS] Updated founder image:', imgSrc);
        }
    }

    // Update history images (founding members and choir)
    if (content.historyImages && content.historyImages.length > 0) {
        const historyImageItems = document.querySelectorAll('.history-image-item img');
        content.historyImages.forEach((img, idx) => {
            if (historyImageItems[idx]) {
                const imagePath = img.src.startsWith('/') ? img.src.substring(1) : img.src;
                const imgSrc = img.src.startsWith('http') ? img.src : `http://localhost:5001/${imagePath}`;
                historyImageItems[idx].src = imgSrc;
                console.log('[CMS] Updated history image', idx + 1, ':', imgSrc);
            }
        });
    }
}

/**
 * Update team images on about page
 */
function updateTeamImages(content) {
    if (!content.staff) return;

    console.log('[CMS] Updating team images');

    content.staff.forEach((member, idx) => {
        const staffImg = document.querySelector(`.staff-card:nth-child(${idx + 1}) img, .staff-member:nth-child(${idx + 1}) img, .team-member:nth-child(${idx + 1}) img`);
        if (staffImg && member.image) {
            const imagePath = member.image.startsWith('/') ? member.image.substring(1) : member.image;
            const imgSrc = member.image.startsWith('http') ? member.image : `http://localhost:5001/${imagePath}`;
            staffImg.src = imgSrc;
            console.log('[CMS] Updated team member image', idx + 1, ':', imgSrc);
        } else {
            console.warn('[CMS] Could not find staff image element for member', idx + 1, 'or image property missing');
        }
    });
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
            const imgSrc = content.image.startsWith('http') ? content.image : `http://localhost:5001/${imagePath}`;
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
                        const imgSrc = card.image.startsWith('http') ? card.image : `http://localhost:5001/${imagePath}`;
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
 * Generic image updater for any page
 * Recursively searches content for image properties and updates them
 */
function updateGenericImages(content, sectionName) {
    console.log('[CMS] Generic image update for section:', sectionName);

    // Helper function to update image URL
    function getImageUrl(src) {
        if (!src) return src;
        const imagePath = src.startsWith('/') ? src.substring(1) : src;
        return src.startsWith('http') ? src : `http://localhost:5001/${imagePath}`;
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
