import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import PageBlocks from '../components/PageBlocks';

interface HomePageProps {
    apiBase: string;
}

export default function HomePage({ apiBase }: HomePageProps) {
    const [layout, setLayout] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${apiBase}/admin/content`)
            .then(res => res.json())
            .then(data => {
                if (data.home_layout) {
                    try {
                        setLayout(JSON.parse(data.home_layout));
                    } catch (e) {
                        console.error('Failed to parse layout', e);
                    }
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [apiBase]);

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    if (layout.length === 0) {
        // Default layout if nothing is configured
        return (
            <Box>
                <PageBlocks layout={[
                    {
                        type: 'hero',
                        content: {
                            title: 'Nature’s Best Kept Secret',
                            subtitle: 'Handcrafted soaps for a radiant, healthy glow.',
                            buttonText: 'Shop Collection',
                            videoUrl: '/images/home/animation1.mp4',
                            fullHeight: true
                        }
                    },
                    {
                        type: 'product-grid',
                        content: {
                            title: 'Top Selling Soaps',
                            filter: 'top-selling', // You'll need to handle this filter in PageBlocks/ProductGrid
                            limit: 3
                        }
                    },
                    {
                        type: 'feature-panel',
                        content: {
                            title: 'Special Offer',
                            subtitle: 'Buy any 3 soaps and get 1 free! Limited time only.',
                            buttonText: 'View Offers',
                            link: '/products',
                            imageUrl: '/images/home/customised.jpg',
                            reverse: true
                        }
                    },
                    {
                        type: 'feature-panel',
                        content: {
                            title: 'Create Your Custom Soap',
                            subtitle: 'Choose your ingredients, scent, and style. Made just for you.',
                            buttonText: 'Start Customizing',
                            link: '/custom-soap',
                            imageUrl: '/images/home/logo.jpg'
                        }
                    },
                    { type: 'testimonials', content: { title: 'What Our Customers Say' } }
                ]} />
            </Box>
        );
    }

    return (
        <Box>
            <PageBlocks layout={layout} />
        </Box>
    );
}
