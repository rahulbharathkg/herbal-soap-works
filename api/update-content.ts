import 'reflect-metadata';
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
        id: 'testimonials-1',
        type: 'testimonials',
        content: {
            title: 'Customer Stories',
            reviews: [
                { text: "The best organic soap I've ever used. My acne cleared up in weeks!", author: "Emily R." },
                { text: "I love the custom soap builder. Made a perfect gift for my mom.", author: "David K." },
                { text: "Gentle, moisturizing, and smells divine. Highly recommended!", author: "Sarah L." }
            ]
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

    // Check if 'home_layout' key exists
    let content = await repo.findOne({ where: { key: 'home_layout' } });

    if (!content) {
        console.log('Creating new home_layout key...');
        content = repo.create({ key: 'home_layout', type: 'json' });
    } else {
        console.log('Updating existing home_layout key...');
    }

    content.value = JSON.stringify(homeLayout);
    await repo.save(content);

    console.log('Home Page Layout Updated!');
    process.exit(0);
}

update();
