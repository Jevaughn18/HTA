require('dotenv').config();
const ImageKit = require('imagekit');
const fs = require('fs');
const path = require('path');

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadCam1() {
    const filePath = path.join(__dirname, 'assets/cam1.mp4');

    console.log('📤 Uploading cam1.mp4 (79MB) using binary upload...\n');

    try {
        const fileContent = fs.readFileSync(filePath);

        const response = await imagekit.upload({
            file: fileContent, // Send as buffer (binary), not base64
            fileName: 'cam1.mp4',
            folder: '/videos',
            useUniqueFileName: false,
            tags: ['church-website', 'large-file']
        });

        console.log('✅ Successfully uploaded cam1.mp4!');
        console.log(`URL: ${response.url}\n`);

    } catch (error) {
        console.error('❌ Failed to upload cam1.mp4:', error.message);
        console.error('Full error:', error);
    }
}

uploadCam1();
