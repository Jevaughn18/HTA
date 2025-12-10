const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

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
router.post('/upload', auth, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        res.json({
            message: 'File uploaded successfully',
            file: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                path: `/uploads/${req.file.filename}`
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'File upload failed' });
    }
});

// Upload multiple files
router.post('/upload-multiple', auth, upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const files = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            path: `/uploads/${file.filename}`
        }));

        res.json({
            message: 'Files uploaded successfully',
            files
        });
    } catch (error) {
        res.status(500).json({ error: 'File upload failed' });
    }
});

// Get all uploaded files
router.get('/files', auth, (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir).map(filename => ({
            filename,
            path: `/uploads/${filename}`,
            size: fs.statSync(path.join(uploadsDir, filename)).size
        }));

        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

// Delete file
router.delete('/files/:filename', auth, (req, res) => {
    try {
        const filePath = path.join(uploadsDir, req.params.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        fs.unlinkSync(filePath);
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

// Serve uploaded files
router.use('/uploads', express.static(uploadsDir));

module.exports = router;
