require('dotenv').config();
const ImageKit = require('imagekit');
const fs = require('fs');
const path = require('path');

// Initialize ImageKit with environment variables
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Files to upload
const filesToUpload = [
    // Videos
    { localPath: 'assets/handgreet.mp4', fileName: 'handgreet.mp4', folder: '/videos' },
    { localPath: 'assets/group.MOV', fileName: 'group.MOV', folder: '/videos' },
    { localPath: 'assets/cam1.mp4', fileName: 'cam1.mp4', folder: '/videos' },
    { localPath: 'assets/bible.mp4', fileName: 'bible.mp4', folder: '/videos' },
    { localPath: 'assets/give.mp4', fileName: 'give.mp4', folder: '/videos' },
    { localPath: 'assets/dep.mp4', fileName: 'dep.mp4', folder: '/videos' },

    // Images - with renamed filenames (spaces replaced with underscores)
    { localPath: 'assets/og members.png', fileName: 'og_members.png', folder: '/images' },
    { localPath: 'assets/Og Choir.png', fileName: 'Og_Choir.png', folder: '/images' },
    { localPath: 'assets/bishopcarter.png', fileName: 'bishopcarter.png', folder: '/images' }
];

// Function to get file size in MB
function getFileSizeMB(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size / (1024 * 1024);
}

// Function to upload a single file
async function uploadFile(fileInfo) {
    const filePath = path.join(__dirname, fileInfo.localPath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return;
    }

    const fileSizeMB = getFileSizeMB(filePath);
    console.log(`📤 Uploading: ${fileInfo.fileName} (${fileSizeMB.toFixed(2)}MB)...`);

    try {
        const fileContent = fs.readFileSync(filePath);

        // For files larger than 50MB (which become >70MB in base64), use binary
        let uploadData;
        if (fileSizeMB > 50) {
            console.log(`   Using binary upload for large file...`);
            uploadData = {
                file: fileContent, // Send as buffer (binary)
                fileName: fileInfo.fileName,
                folder: fileInfo.folder,
                useUniqueFileName: false,
                tags: ['church-website']
            };
        } else {
            // For smaller files, base64 is fine
            const base64File = fileContent.toString('base64');
            uploadData = {
                file: base64File,
                fileName: fileInfo.fileName,
                folder: fileInfo.folder,
                useUniqueFileName: false,
                tags: ['church-website']
            };
        }

        const response = await imagekit.upload(uploadData);

        console.log(`✅ Successfully uploaded: ${fileInfo.fileName}`);
        console.log(`   URL: ${response.url}\n`);

        return response;
    } catch (error) {
        console.error(`❌ Failed to upload ${fileInfo.fileName}:`, error.message);
        if (error.help) console.error(`   Suggestion: ${error.help}`);
    }
}

// Main upload function
async function uploadAllFiles() {
    console.log('🚀 Starting ImageKit upload...\n');
    console.log(`Total files to upload: ${filesToUpload.length}\n`);

    const results = { success: 0, failed: 0 };

    for (const fileInfo of filesToUpload) {
        const result = await uploadFile(fileInfo);
        if (result) {
            results.success++;
        } else {
            results.failed++;
        }
        // Add a small delay between uploads
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('✨ Upload process completed!');
    console.log(`✅ Successful: ${results.success}`);
    console.log(`❌ Failed: ${results.failed}`);
}

// Run the upload
uploadAllFiles().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
