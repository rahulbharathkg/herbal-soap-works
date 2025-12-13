
import fs from 'fs';
import path from 'path';
import https from 'https';

const TARGET_DIR = path.join(process.cwd(), 'frontend/public/images/custom');

const ASSETS = {
    // Goals
    'goal-acne.jpg': 'https://images.unsplash.com/photo-XObp7ppuIbc?auto=format&fit=crop&w=400&q=80', // Charcoal/Dark Cleanse
    'goal-tan.jpg': 'https://images.unsplash.com/photo-YQZla74xiNg?auto=format&fit=crop&w=400&q=80', // Aloe/Bright
    'goal-soft.jpg': 'https://images.unsplash.com/photo-bEQPldh9jmk?auto=format&fit=crop&w=400&q=80', // Shea/Soft Texture
    'goal-oil.jpg': 'https://images.unsplash.com/photo-Ci1nQNQDfmA?auto=format&fit=crop&w=400&q=80', // Clear Oil/Water
    'goal-aging.jpg': 'https://images.unsplash.com/photo-aF1NPSnDQLw?auto=format&fit=crop&w=400&q=80', // Red Wine/Elegant
    'goal-glow.jpg': 'https://images.unsplash.com/photo-ReiMJUT19uI?auto=format&fit=crop&w=400&q=80', // Golden Oil/Glow

    // Bases
    'base-goat.jpg': 'https://images.unsplash.com/photo-WUWGO6xmvoY?auto=format&fit=crop&w=200&q=80', // Milk/White
    'base-glyc.jpg': 'https://images.unsplash.com/photo-Ci1nQNQDfmA?auto=format&fit=crop&w=200&q=80', // Clear
    'base-aloe.jpg': 'https://images.unsplash.com/photo-MdVGSr3HRWQ?auto=format&fit=crop&w=200&q=80', // Aloe Slice
    'base-shea.jpg': 'https://images.unsplash.com/photo-UWQepYM0kLU?auto=format&fit=crop&w=200&q=80', // Butter Texture

    // Ingredients
    'ing-wine.jpg': 'https://images.unsplash.com/photo-hK9hIPgF3QU?auto=format&fit=crop&w=200&q=80', // Red Wine Glass
    'ing-char.jpg': 'https://images.unsplash.com/photo-y6r0r77k4ek?auto=format&fit=crop&w=200&q=80', // Charcoal Powder
    'ing-sand.jpg': 'https://images.unsplash.com/photo-JpnqiMBf7zQ?auto=format&fit=crop&w=200&q=80', // Sandalwood Oil
    'ing-manj.jpg': 'https://images.unsplash.com/photo-zmtkrxDM0bE?auto=format&fit=crop&w=200&q=80', // Reddish/Woody
    'ing-coff.jpg': 'https://images.unsplash.com/photo-T4SAXtjQJ8Q?auto=format&fit=crop&w=200&q=80', // Dark Powder
    'ing-neem.jpg': 'https://images.unsplash.com/photo-YQZla74xiNg?auto=format&fit=crop&w=200&q=80', // Green/Aloe substitute
    'ing-honey.jpg': 'https://images.unsplash.com/photo-ReiMJUT19uI?auto=format&fit=crop&w=200&q=80', // Golden Liquid
    'ing-mult.jpg': 'https://images.unsplash.com/photo-s2ycLz9R7Jw?auto=format&fit=crop&w=200&q=80', // Earthy/Texture

    // Oils
    'oil-alm.jpg': 'https://images.unsplash.com/photo-ReiMJUT19uI?auto=format&fit=crop&w=200&q=80', // Golden
    'oil-coco.jpg': 'https://images.unsplash.com/photo-WUWGO6xmvoY?auto=format&fit=crop&w=200&q=80', // White
    'oil-oliv.jpg': 'https://images.unsplash.com/photo-JpnqiMBf7zQ?auto=format&fit=crop&w=200&q=80', // Greenish
    'oil-cast.jpg': 'https://images.unsplash.com/photo-Ci1nQNQDfmA?auto=format&fit=crop&w=200&q=80', // Clear

    // Fragrance
    'frag-sand.jpg': 'https://images.unsplash.com/photo-sLJStGA-Ys0?auto=format&fit=crop&w=200&q=80', // Woody
    'frag-van.jpg': 'https://images.unsplash.com/photo-UWQepYM0kLU?auto=format&fit=crop&w=200&q=80', // Creamy
    'frag-rose.jpg': 'https://images.unsplash.com/photo-aF1NPSnDQLw?auto=format&fit=crop&w=200&q=80', // Red
    'frag-lav.jpg': 'https://images.unsplash.com/photo-hK9hIPgF3QU?auto=format&fit=crop&w=200&q=80', // Dark/Elegant
    'frag-tea.jpg': 'https://images.unsplash.com/photo-YPc_zAHXEqc?auto=format&fit=crop&w=200&q=80', // Green

    // Boosters
    'boost-ret.jpg': 'https://images.unsplash.com/photo-ReiMJUT19uI?auto=format&fit=crop&w=200&q=80', // Golden Serum
    'boost-hya.jpg': 'https://images.unsplash.com/photo-Ci1nQNQDfmA?auto=format&fit=crop&w=200&q=80', // Clear Dropper
    'boost-nia.jpg': 'https://images.unsplash.com/photo-WUWGO6xmvoY?auto=format&fit=crop&w=200&q=80', // White Cream
    'boost-vit.jpg': 'https://images.unsplash.com/photo-ReiMJUT19uI?auto=format&fit=crop&w=200&q=80', // Oil Texture
};

async function downloadImage(url: string, filename: string) {
    return new Promise<void>((resolve, reject) => {
        const file = fs.createWriteStream(path.join(TARGET_DIR, filename));
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                console.error(`Failed to download ${filename}: ${response.statusCode}`);
                response.resume();
                reject(new Error(`Status ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(path.join(TARGET_DIR, filename), () => { });
            console.error(`Error downloading ${filename}: ${err.message}`);
            reject(err);
        });
    });
}

async function main() {
    console.log('Starting image download...');
    const promises = Object.entries(ASSETS).map(([filename, url]) =>
        downloadImage(url, filename).catch(e => console.error(e))
    );
    await Promise.all(promises);
    console.log('All done.');
}

main();
