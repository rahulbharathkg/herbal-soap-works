import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { HeroBlock, TextBlock, ProductGridBlock, ImageBlock } from '../components/PageBlocks';

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
        return (
            <Box textAlign="center" mt={10}>
                <Typography variant="h5">Welcome to Herbal Soap Works</Typography>
                <Typography color="textSecondary">No content configured. Go to Admin Panel to build your page.</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {layout.map((block) => {
                switch (block.type) {
                    case 'hero': return <HeroBlock key={block.id} content={block.content} />;
                    case 'text': return <TextBlock key={block.id} content={block.content} />;
                    case 'product-grid': return <ProductGridBlock key={block.id} content={block.content} apiBase={apiBase} />;
                    case 'image': return <ImageBlock key={block.id} content={block.content} />;
                    default: return null;
                }
            })}
        </Box>
    );
}
