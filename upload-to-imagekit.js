const ImageKit = require('imagekit');
const fs = require('fs');
const path = require('path');

// Initialize ImageKit with your credentials
const imagekit = new ImageKit({
    publicKey: "public_WwiLT3Ksbnv2cSBp4wKQVfT8sm0=",
    privateKey: "private_OWKmTP4BUiRieadJW+NfCLjpLdA=",
    urlEndpoint: "https://ik.imagekit.io/vspqi4z1t"
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

// Function to upload a single file
async function uploadFile(fileInfo) {
    const filePath = path.join(__dirname, fileInfo.localPath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return;
    }

    console.log(`📤 Uploading: ${fileInfo.fileName}...`);

    try {
        const fileContent = fs.readFileSync(filePath);
        const base64File = fileContent.toString('base64');

        const response = await imagekit.upload({
            file: base64File,
            fileName: fileInfo.fileName,
            folder: fileInfo.folder,
            useUniqueFileName: false, // Keep the exact filename
            tags: ['church-website']
        });

        console.log(`✅ Successfully uploaded: ${fileInfo.fileName}`);
        console.log(`   URL: ${response.url}\n`);

        return response;
    } catch (error) {
        console.error(`❌ Failed to upload ${fileInfo.fileName}:`, error.message);
    }
}

// Main upload function
async function uploadAllFiles() {
    console.log('🚀 Starting ImageKit upload...\n');
    console.log(`Total files to upload: ${filesToUpload.length}\n`);

    for (const fileInfo of filesToUpload) {
        await uploadFile(fileInfo);
        // Add a small delay between uploads to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('✨ Upload process completed!');
}

// Run the upload
uploadAllFiles().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
