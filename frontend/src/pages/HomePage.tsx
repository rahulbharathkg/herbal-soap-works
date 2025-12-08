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
                    { type: 'hero', content: { title: 'Welcome to Herbal Soap Works', subtitle: 'Natural, Handcrafted Soaps for Radiant Skin', buttonText: 'Shop Now' } },
                    { type: 'hero', content: { title: 'Create Your Own Soap', subtitle: 'Customize ingredients, scents, and colors just for you.', buttonText: 'Start Customizing', link: '/custom-soap', imageUrl: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' } },
                    { type: 'product-grid', content: { title: 'Our Products' } }
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
