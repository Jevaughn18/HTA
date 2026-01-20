const express = require('express');
const Content = require('../models/Content');
const { auth } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

const router = express.Router();

// Allowed pages enum
const ALLOWED_PAGES = ['home', 'about', 'departments', 'media', 'contact', 'events', 'give', 'shared'];

// Get all content for a specific page
router.get('/:page',
    [
        param('page').isIn(ALLOWED_PAGES).withMessage('Invalid page')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const content = await Content.find({ page: req.params.page })
                .populate('updatedBy', 'name email');
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch content' });
        }
    }
);

// Get specific section content
router.get('/:page/:section',
    [
        param('page').isIn(ALLOWED_PAGES).withMessage('Invalid page'),
        param('section').trim().notEmpty().isLength({ max: 100 }).withMessage('Invalid section')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const content = await Content.findOne({
                page: req.params.page,
                section: req.params.section
            }).populate('updatedBy', 'name email');

            if (!content) {
                return res.status(404).json({ error: 'Content not found' });
            }

            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch content' });
        }
    }
);

// Create or update content (requires authentication)
router.post('/:page/:section',
    auth,
    [
        param('page').isIn(ALLOWED_PAGES).withMessage('Invalid page'),
        param('section').trim().notEmpty().isLength({ max: 100 }).withMessage('Invalid section'),
        body('content').custom((value) => {
            // Content can be any type but must exist
            if (value === null || value === undefined) {
                throw new Error('Content is required');
            }
            // If content is a string (HTML), sanitize it
            if (typeof value === 'string') {
                // Allow specific HTML tags for CMS content
                const sanitized = sanitizeHtml(value, {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'iframe']),
                    allowedAttributes: {
                        ...sanitizeHtml.defaults.allowedAttributes,
                        '*': ['class', 'style'],
                        'img': ['src', 'alt', 'width', 'height', 'class', 'style'],
                        'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
                    },
                    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com', 'ik.imagekit.io']
                });
                return true;
            }
            return true;
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { page, section } = req.params;
            let { content } = req.body;

            // Sanitize HTML content
            if (typeof content === 'string') {
                content = sanitizeHtml(content, {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'iframe']),
                    allowedAttributes: {
                        ...sanitizeHtml.defaults.allowedAttributes,
                        '*': ['class', 'style'],
                        'img': ['src', 'alt', 'width', 'height', 'class', 'style'],
                        'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
                    },
                    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com', 'ik.imagekit.io']
                });
            }

            const updatedContent = await Content.findOneAndUpdate(
                { page, section },
                {
                    page,
                    section,
                    content,
                    updatedBy: req.user._id
                },
                { new: true, upsert: true }
            ).populate('updatedBy', 'name email');

            res.json({
                message: 'Content updated successfully',
                content: updatedContent
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update content' });
        }
    }
);

// Delete content (requires authentication)
router.delete('/:page/:section',
    auth,
    [
        param('page').isIn(ALLOWED_PAGES).withMessage('Invalid page'),
        param('section').trim().notEmpty().isLength({ max: 100 }).withMessage('Invalid section')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { page, section } = req.params;

            const content = await Content.findOneAndDelete({ page, section });

            if (!content) {
                return res.status(404).json({ error: 'Content not found' });
            }

            res.json({ message: 'Content deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete content' });
        }
    }
);

// Get all pages
router.get('/', async (req, res) => {
    try {
        const pages = await Content.distinct('page');
        res.json(pages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

module.exports = router;
