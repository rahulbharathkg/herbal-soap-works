
import { AppDataSource } from '../data-source.js';
import { AdminContent } from '../entities/AdminContent.js';

async function updateHomeLayout() {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        const contentRepo = AppDataSource.getRepository(AdminContent);
        let content = await contentRepo.findOneBy({ key: 'home_layout' });

        if (content) {
            const blocks = JSON.parse(content.value);

            // Find the customization block
            const customBlockIndex = blocks.findIndex((b: any) => b.content.title === 'Create Your Own Soap');

            if (customBlockIndex !== -1) {
                blocks[customBlockIndex].content = {
                    ...blocks[customBlockIndex].content,
                    link: '/custom-soap',
                    buttonText: 'Start Creating',
                    bgcolor: '#4a148c',
                    backgroundImage: 'https://placehold.co/1920x600/4a148c/ffffff?text=Custom+Soap+Builder',
                    subtitle: 'Choose your base, scents, and ingredients. Visualize your creation instantly.'
                };

                content.value = JSON.stringify(blocks);
                await contentRepo.save(content);
                console.log('Updated Home Layout with enhanced Customization Banner');
            } else {
                console.log('Customization block not found');
            }
        } else {
            console.log('Home layout not found');
        }

    } catch (error) {
        console.error('Error updating layout:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

updateHomeLayout();
