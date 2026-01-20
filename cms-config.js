/**
 * CMS Configuration
 * Automatically detects environment and uses appropriate API URL
 */
(function () {
    // Detect if running locally or in production
    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('192.168');

    // ALWAYS use production backend (Render) for images
    // This ensures images load even if local backend isn't running
    const apiUrl = 'https://hta-kwfr.onrender.com';

    console.log('[CMS Config] Environment:', isLocalhost ? 'LOCAL' : 'PRODUCTION');
    console.log('[CMS Config] API URL:', apiUrl);

    // Export for use in other scripts
    window.CMS_CONFIG = {
        API_BASE_URL: apiUrl,
        isLocalhost
    };
})();
