
import { getDataSource } from '../api/shared/db';
import { Product } from '../api/shared/Product';

async function updateProducts() {
    try {
        const ds = await getDataSource();
        const productRepo = ds.getRepository(Product);

        const updates = [
            {
                name: 'Coffee Honey Soap',
                imageUrl: '/images/products/coffee honey/coffee honey 1.png', // Main image
                images: JSON.stringify([
                    '/images/products/coffee honey/coffee honey 1.png',
                    '/images/products/coffee honey/coffee honey card.png'
                ]),
                description: 'Exfoliating coffee and moisturizing honey blend. Hero Ingredients: Coffee (Exfoliation, Antioxidants), Honey (Moisturizing, Antibacterial), Goat Milk (Gentle & Soothing).'
            },
            {
                name: 'Tan Removal Soap',
                imageUrl: '/images/products/tan removal soap/tan 1.png',
                images: JSON.stringify([
                    '/images/products/tan removal soap/tan 1.png',
                    '/images/products/tan removal soap/tan card.png'
                ]),
                description: 'Say goodbye to stubborn tan lines! Hero Ingredients: Niacinamide (Brightening), Potato (Blemish Control), Multani Mitti (Oil Control), Almond Oil (Vitamin E).'
            },
            {
                name: 'Red Wine Soap',
                imageUrl: '/images/products/red wine soap/redwine 1.jpg',
                images: JSON.stringify([
                    '/images/products/red wine soap/redwine 1.jpg',
                    '/images/products/red wine soap/redwine card.png'
                ]),
                description: 'Get your glow on with antioxidant-rich Red Wine Soap! Hero Ingredients: Red Wine (Anti-aging), Frankincense (Healing), Coconut Oil (Nourishing).'
            },
            {
                name: 'Sandalwood Soap',
                imageUrl: '/images/products/sandalwood soap/sandalwood 1.PNG',
                images: JSON.stringify([
                    '/images/products/sandalwood soap/sandalwood 1.PNG',
                    '/images/products/sandalwood soap/sandalwood card.PNG'
                ]),
                description: 'Transform your skincare ritual with luxurious handcrafted Sandalwood Soap! Hero Ingredients: Sandalwood Oil (Calming), Sandalwood Powder (Brightening), Aloe Vera (Soothing).'
            },
            // Fallbacks for others if needed
            {
                name: 'Charcoal Soap',
                imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?ixlib=rb-4.0.3', // Placeholder until local pic
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1596462502278-27bfdd403348?ixlib=rb-4.0.3',
                    'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?ixlib=rb-4.0.3'
                ])
            },
            {
                name: 'Goat Milk Soap',
                imageUrl: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?ixlib=rb-4.0.3', // Placeholder until local pic
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?ixlib=rb-4.0.3',
                    'https://images.unsplash.com/photo-1596462502278-27bfdd403348?ixlib=rb-4.0.3'
                ])
            }
        ];

        for (const update of updates) {
            const product = await productRepo.findOne({ where: { name: update.name } });
            if (product) {
                product.imageUrl = update.imageUrl;
                product.images = update.images;
                if (update.description) product.description = update.description;
                await productRepo.save(product);
                console.log(`Updated ${product.name}`);
            } else {
                console.log(`Skipped ${update.name} (Not Found)`);
            }
        }

        console.log('Done!');
        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

updateProducts();
