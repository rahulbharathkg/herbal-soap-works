import { getDataSource } from './shared/db';
import { Product } from './shared/Product';

const productsData = [
    {
        name: "Coffee Honey Soap",
        description: "Exfoliating coffee and moisturizing honey blend. Hero Ingredients: Coffee (Exfoliation, Antioxidants), Honey (Moisturizing, Antibacterial), Goat Milk (Gentle & Soothing).",
        price: "80",
        imageUrl: "/images/products/coffee honey/3.jpg" // Heuristic based on folders
    },
    {
        name: "Tan Removal Soap",
        description: "Say goodbye to stubborn tan lines! Hero Ingredients: Niacinamide, Potato, Multani mitti, Almond oil, Sandalwood Essential oil.",
        price: "80",
        imageUrl: "/images/products/tan removal soap/4.jpg" // Heuristic
    },
    {
        name: "Allocera Charcoal Soap", // Corrected name from "Charcoal Soap" to user's "Aloevera Charcoal" if needed, but keeping simple matching first
        description: "Blended Aloe and Charcoal benefits. Hero Ingredients: Aloevera, Charcoal, Tea tree essential oil. Suits oily to combinational skin.",
        price: "80",
        imageUrl: "/images/products/charcoal soap/1.jpg"
    },
    {
        name: "Red Wine Soap",
        description: "Get your glow on with antioxidant-rich Red Wine Soap! Ingredients: Red wine (Improves texture), Frankincense oil, Coconut oil, Castor oil.",
        price: "280", // User said 280 in one place, 95 in another? User json said 280. Staying with 280.
        imageUrl: "/images/products/red wine soap/5.jpg"
    },
    {
        name: "Sandalwood Soap",
        description: "Transform your skincare ritual with luxurious handcrafted Sandalwood Soap! Ingredients: Sandalwood oil, Sandalwood powder, Aloe vera gel.",
        price: "85",
        imageUrl: "/images/products/sandalwood soap/2.jpg"
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
