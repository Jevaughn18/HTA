const express = require('express');
const Content = require('../models/Content');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all content for a specific page
router.get('/:page', async (req, res) => {
    try {
        const content = await Content.find({ page: req.params.page })
            .populate('updatedBy', 'name email');
        console.log(`Content fetch: page=${req.params.page} count=${content.length}`);
        res.json(content);
    } catch (error) {
        console.error(`Content fetch failed: page=${req.params.page}`, error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});

// Get specific section content
router.get('/:page/:section', async (req, res) => {
    try {
        const content = await Content.findOne({
            page: req.params.page,
            section: req.params.section
        }).populate('updatedBy', 'name email');

        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }

        console.log(`Content fetch: page=${req.params.page} section=${req.params.section}`);
        res.json(content);
    } catch (error) {
        console.error(`Content fetch failed: page=${req.params.page} section=${req.params.section}`, error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});

// Create or update content (requires authentication)
router.post('/:page/:section', auth, async (req, res) => {
    try {
        const { page, section } = req.params;
        const { content } = req.body;

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

        console.log(`Content update: page=${page} section=${section} user=${req.user.email}`);
        res.json({
            message: 'Content updated successfully',
            content: updatedContent
        });
    } catch (error) {
        console.error(`Content update failed: page=${req.params.page} section=${req.params.section}`, error);
        res.status(500).json({ error: 'Failed to update content' });
    }
});

// Delete content (requires authentication)
router.delete('/:page/:section', auth, async (req, res) => {
    try {
        const { page, section } = req.params;

        const content = await Content.findOneAndDelete({ page, section });

        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }

        console.log(`Content delete: page=${page} section=${section} user=${req.user.email}`);
        res.json({ message: 'Content deleted successfully' });
    } catch (error) {
        console.error(`Content delete failed: page=${req.params.page} section=${req.params.section}`, error);
        res.status(500).json({ error: 'Failed to delete content' });
    }
});

// Get all pages
router.get('/', async (req, res) => {
    try {
        const pages = await Content.distinct('page');
        console.log(`Content pages fetch: count=${pages.length}`);
        res.json(pages);
    } catch (error) {
        console.error('Content pages fetch failed', error);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

module.exports = router;
