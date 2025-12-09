import { getDataSource } from '../api/shared/db';
import { Product } from './shared/Product';

const productsData = [
    {
        name: "Coffee Honey Soap",
        description: "Exfoliating coffee and moisturizing honey blend. Hero Ingredients: Coffee (Exfoliation, Antioxidants), Honey (Moisturizing, Antibacterial), Goat Milk (Gentle & Soothing).",
        price: 80,
        imageUrl: "/images/products/coffee honey/coffee honey card.png"
    },
    {
        name: "Tan Removal Soap",
        description: "Say goodbye to stubborn tan lines! Hero Ingredients: Niacinamide, Potato, Multani mitti, Almond oil, Sandalwood Essential oil.",
        price: 80,
        imageUrl: "/images/products/tan removal soap/tan card.png"
    },
    {
        name: "Allocera Charcoal Soap",
        description: "Blended Aloe and Charcoal benefits. Hero Ingredients: Aloevera, Charcoal, Tea tree essential oil. Suits oily to combinational skin.",
        price: 80,
        imageUrl: "/images/home/logo.jpg" // Fallback as charcoal dir was empty
    },
    {
        name: "Red Wine Soap",
        description: "Get your glow on with antioxidant-rich Red Wine Soap! Ingredients: Red wine (Improves texture), Frankincense oil, Coconut oil, Castor oil.",
        price: 280,
        imageUrl: "/images/products/red wine soap/redwine card.png"
    },
    {
        name: "Sandalwood Soap",
        description: "Transform your skincare ritual with luxurious handcrafted Sandalwood Soap! Ingredients: Sandalwood oil, Sandalwood powder, Aloe vera gel.",
        price: 85,
        imageUrl: "/images/products/sandalwood soap/sandalwood card.PNG"
    }
];

async function update() {
    console.log('Connecting to DB...');
    const ds = await getDataSource();
    const repo = ds.getRepository(Product);

    console.log('Updating products...');
    for (const p of productsData) {
        // Fuzzy match name
        const existing = await repo.createQueryBuilder('p')
            .where('p.name ILIKE :name', { name: `%${p.name}%` })
            .getOne();

        if (existing) {
            console.log(`Updating ${existing.name}...`);
            existing.description = p.description;
            existing.imageUrl = p.imageUrl;
            // existing.price = p.price; // Optional: Update price if needed
            await repo.save(existing);
        } else {
            console.log(`Product ${p.name} not found, creating...`);
            const newP = repo.create(p);
            await repo.save(newP);
        }
    }
    console.log('Done!');
    process.exit(0);
}

update();
