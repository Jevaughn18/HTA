const express = require('express');
const multer = require('multer');
const path = require('path');
const ImageKit = require('imagekit');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Configure multer to store files in memory (not disk)
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images and videos are allowed'));
        }
    }
});

// Upload single file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload to ImageKit
        const uploadResponse = await imagekit.upload({
            file: req.file.buffer.toString('base64'),
            fileName: req.file.originalname,
            folder: '/hta-cms'
        });

        res.json({
            message: 'File uploaded successfully',
            file: {
                filename: uploadResponse.name,
                originalName: req.file.originalname,
                size: req.file.size,
                path: uploadResponse.url,
                fileId: uploadResponse.fileId
            }
        });
    } catch (error) {
        console.error('ImageKit upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
});

// Upload multiple files
router.post('/upload-multiple', auth, upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Upload all files to ImageKit
        const uploadPromises = req.files.map(file =>
            imagekit.upload({
                file: file.buffer.toString('base64'),
                fileName: file.originalname,
                folder: '/hta-cms'
            })
        );

        const uploadResponses = await Promise.all(uploadPromises);

        const files = uploadResponses.map((response, idx) => ({
            filename: response.name,
            originalName: req.files[idx].originalname,
            size: req.files[idx].size,
            path: response.url,
            fileId: response.fileId
        }));

        res.json({
            message: 'Files uploaded successfully',
            files
        });
    } catch (error) {
        console.error('ImageKit upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
});

// Get all uploaded files from ImageKit
router.get('/files', auth, async (req, res) => {
    try {
        const result = await imagekit.listFiles({
            path: '/hta-cms',
            limit: 1000
        });

        const files = result.map(file => ({
            filename: file.name,
            path: file.url,
            size: file.size,
            fileId: file.fileId
        }));

        res.json(files);
    } catch (error) {
        console.error('ImageKit list files error:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

// Delete file from ImageKit
router.delete('/files/:fileId', auth, async (req, res) => {
    try {
        await imagekit.deleteFile(req.params.fileId);
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('ImageKit delete error:', error);
        if (error.message && error.message.includes('not found')) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

module.exports = router;
