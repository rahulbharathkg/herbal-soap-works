import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardMedia, CardContent, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Types ---
export interface BlockProps {
    content: any;
    onEdit?: () => void; // For Admin Mode
}

// --- Hero Block ---
export const HeroBlock: React.FC<BlockProps> = ({ content, onEdit }) => {
    return (
        <Box
            onClick={onEdit}
            sx={{
                position: 'relative',
                height: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
      < Box
        onClick={onEdit}
            sx={{
                height: '600px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: !content.videoUrl ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${content.imageUrl || 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?ixlib=rb-4.0.3'})` : 'none',
                position: 'relative',
                overflow: 'hidden',
                cursor: onEdit ? 'pointer' : 'default',
                '&:hover': onEdit ? { outline: '2px solid blue' } : {}
            }}
        >
            {content.videoUrl && (
                <video
                    src={content.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'translate(-50%, -50%)',
                        zIndex: -1
                    }}
                />
            )}
            {/* Overlay for readability if needed */}
            {content.videoUrl && <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.3)' }} />}

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <Typography variant="h2" fontWeight="bold" gutterBottom>{content.title}</Typography>
                    <Typography variant="h5" mb={4}>{content.subtitle}</Typography>
                    <Button variant="contained" size="large" color="secondary" component={Link} to={content.link || "/products"}>
                        {content.buttonText || "Shop Now"}
                    </Button>
                </motion.div>
            </Container>
        </Box>
    );
};

// --- Text Block ---
export const TextBlock: React.FC<BlockProps> = ({ content, onEdit }) => {
    return (
        <Container
            maxWidth="lg"
            onClick={onEdit}
            sx={{
                py: 4,
                textAlign: content.align || 'left',
                cursor: onEdit ? 'pointer' : 'default',
                '&:hover': onEdit ? { outline: '2px solid blue' } : {}
            }}
        >
            <Typography variant={content.variant || 'body1'}>{content.text}</Typography>
        </Container>
    );
};

// --- Image Block ---
export const ImageBlock: React.FC<BlockProps> = ({ content, onEdit }) => {
    return (
        <Box
            onClick={onEdit}
            sx={{
                width: '100%',
                py: 2,
                cursor: onEdit ? 'pointer' : 'default',
                '&:hover': onEdit ? { outline: '2px solid blue' } : {}
            }}
        >
            <img src={content.imageUrl} alt="Block" style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }} />
        </Box>
    );
};

// --- Product Grid Block ---
// Note: In a real app, this would fetch products. For now, we'll accept products as a prop or fetch them.
// To keep it simple, we'll fetch inside or use a context. Let's fetch for now.

export const ProductGridBlock: React.FC<BlockProps & { apiBase: string }> = ({ content, onEdit, apiBase }) => {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        fetch(`${apiBase}/products?limit=${content.limit || 4}`)
            .then(res => res.json())
            .then(data => setProducts(data.products || []));
    }, [apiBase, content.limit]);

    return (
        <Container
            maxWidth="xl"
            onClick={onEdit}
            sx={{
                py: 8,
                cursor: onEdit ? 'pointer' : 'default',
                '&:hover': onEdit ? { outline: '2px solid blue' } : {}
            }}
        >
            <Grid container spacing={4}>
                {products.map((product) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                        <Card sx={{ height: '100%' }}>
                            <CardMedia component="img" height="300" image={product.imageUrl} alt={product.name} />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>{product.name}</Typography>
                                <Typography variant="body2" color="text.secondary" mb={2}>{product.description}</Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" color="primary">${product.price}</Typography>
                                    <Button variant="outlined" size="small">Add to Cart</Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};
// --- Main PageBlocks Component ---
export const PageBlocks: React.FC<{ layout: any[] }> = ({ layout }) => {
    // Use production API URL or localhost
    const apiBase = process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://herbal-soap-works-backend.fly.dev/api' : 'http://localhost:4000/api');

    if (!layout || !Array.isArray(layout)) return null;

    return (
        <Box>
            {layout.map((block) => {
                switch (block.type) {
                    case 'hero': return <HeroBlock key={block.id} content={block.content} />;
                    case 'text': return <TextBlock key={block.id} content={block.content} />;
                    case 'image': return <ImageBlock key={block.id} content={block.content} />;
                    case 'grid': return <ProductGridBlock key={block.id} content={block.content} apiBase={apiBase} />;
                    default: return null;
                }
            })}
        </Box>
    );
};

export default PageBlocks;
