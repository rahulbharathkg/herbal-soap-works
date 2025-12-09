
import 'reflect-metadata';
import { getDataSource } from '../api/shared/db';
import { Product } from '../api/shared/Product';

async function cleanupProducts() {
    console.log('Connecting to DB...');
    const ds = await getDataSource();
    const repo = ds.getRepository(Product);

    console.log('Searching for test products...');
    const products = await repo.find();

    // Filter for products with "test" or "sf" in the name (case insensitive)
    const toDelete = products.filter(p =>
        p.name.toLowerCase().includes('test') ||
        p.name.toLowerCase().includes('sf')
    );

    if (toDelete.length > 0) {
        console.log(`Found ${toDelete.length} products to delete: ${toDelete.map(p => p.name).join(', ')}`);
        await repo.remove(toDelete);
        console.log('Deletion complete.');
    } else {
        console.log('No test products found.');
    }

    process.exit(0);
}

cleanupProducts();
