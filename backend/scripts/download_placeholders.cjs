const https = require('https');
const fs = require('fs');
const path = require('path');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../../frontend/public/images/products');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Unsplash Source URLs for soap/skincare themed images
const imageUrls = [
    { url: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800&h=800&fit=crop', name: 'hero-banner.jpg' },
    { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop', name: 'product-soap-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1585155770960-3cbf14fc8e18?w=800&h=800&fit=crop', name: 'product-soap-2.jpg' },
    { url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=800&fit=crop', name: 'product-soap-3.jpg' },
    { url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop', name: 'product-soap-4.jpg' },
    { url: 'https://images.unsplash.com/photo-1615485290382-2f9c75b5f6f7?w=800&h=800&fit=crop', name: 'product-soap-5.jpg' },
    { url: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=800&fit=crop', name: 'product-soap-6.jpg' },
    { url: 'https://images.unsplash.com/photo-1594028896699-6dd43d9c31ed?w=800&h=800&fit=crop', name: 'skincare-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1584305574239-206bfee2e5a7?w=800&h=800&fit=crop', name: 'skincare-2.jpg' },
    { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&h=600&fit=crop', name: 'banner-wide.jpg' },
];

function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(imagesDir, filename);
        const file = fs.createWriteStream(filepath);

        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✓ Downloaded: ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            console.error(`✗ Failed to download ${filename}:`, err.message);
            reject(err);
        });
    });
}

async function downloadAll() {
    console.log('📦 Downloading placeholder images...\n');
    for (const { url, name } of imageUrls) {
        try {
            await downloadImage(url, name);
        } catch (err) {
            // Continue with next image even if one fails
        }
    }
    console.log('\n✅ Download complete! Images saved to:', imagesDir);
}

downloadAll();
