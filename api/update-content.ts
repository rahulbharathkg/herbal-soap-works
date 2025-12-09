import { getDataSource } from './shared/db';
import { AdminContent } from './shared/AdminContent';

const homeLayout = [
    {
        id: 'hero-1',
        type: 'hero',
        content: {
            title: 'Welcome to Herbal Soap Works',
            subtitle: 'Natural, Handcrafted Soaps for Radiant Skin',
            buttonText: 'Shop Now',
            videoUrl: '/images/home/animation1.mp4'
        }
    },
    {
        id: 'hero-2',
        type: 'hero',
        content: {
            title: 'Create Your Own Soap',
            subtitle: 'Customize ingredients, scents, and colors just for you.',
            buttonText: 'Start Customizing',
            link: '/custom-soap',
            imageUrl: '/images/home/customised.jpg'
        }
    },
    {
        id: 'grid-1',
        type: 'product-grid',
        content: { title: 'Our Products', limit: 6 }
    }
];

async function update() {
    console.log('Connecting to DB...');
    const ds = await getDataSource();
    const repo = ds.getRepository(AdminContent);

    console.log('Updating Home Page Layout...');
    let content = await repo.findOne({ where: { id: 1 } });

    if (!content) {
        content = repo.create({ id: 1 });
    }

    content.home_layout = JSON.stringify(homeLayout);
    await repo.save(content);

    console.log('Home Page Layout Updated!');
    process.exit(0);
}

update();
