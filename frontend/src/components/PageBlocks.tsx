import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardMedia, CardContent, Container, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard, { Product } from './ProductCard';

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
                height: { xs: '300px', md: '450px' }, // Responsive height, smaller on mobile
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

export const ProductGridBlock: React.FC<BlockProps & { apiBase: string }> = ({ content, onEdit, apiBase }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

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
                        <ProductCard
                            product={product}
                            onView={(p) => navigate(`/products/${p.id}`)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};
// --- Main PageBlocks Component ---
// --- Hero Carousel Block ---
export const HeroCarousel: React.FC<{ items: any[], onEdit?: () => void }> = ({ items, onEdit }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent(c => (c + 1) % items.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [items.length]);

    if (!items || items.length === 0) return null;

    return (
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <motion.div
                animate={{ x: `-${current * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ display: 'flex', width: '100%' }} // Keep container width 100%, animate x by percentage
            >
                {items.map((item, idx) => (
                    <Box key={idx} sx={{ width: '100%', flexShrink: 0 }}>
                        <HeroBlock content={item.content} onEdit={onEdit} />
                    </Box>
                ))}
            </motion.div>

            {items.length > 1 && (
                <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1, zIndex: 2 }}>
                    {items.map((_, idx) => (
                        <Box
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: current === idx ? 'white' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

// --- Testimonials Block (Carousel) ---
export const TestimonialsBlock: React.FC<BlockProps> = ({ content }) => {
    const defaultReviews = [
        { text: "This soap changed my skincare routine completely. I love the natural ingredients!", author: "Sarah J.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" },
        { text: "The scents are amazing and not overpowering. Will definitely buy again.", author: "Mike T.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e" },
        { text: "Best gift for my family. The packaging is eco-friendly and beautiful.", author: "Emily R.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
    ];

    const reviews = content.reviews || defaultReviews;
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setCurrent(c => (c + 1) % reviews.length), 6000);
        return () => clearInterval(timer);
    }, [reviews.length]);

    return (
        <Box sx={{ py: 10, bgcolor: '#fafafa', textAlign: 'center' }}>
            <Container maxWidth="md">
                <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={2} gutterBottom>
                    TESTIMONIALS
                </Typography>
                <Typography variant="h3" fontWeight="bold" mb={6}>
                    {content.title || "Customer Love"}
                </Typography>

                <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: 300 }}>
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Box
                            component="img"
                            src={reviews[current].image}
                            alt={reviews[current].author}
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                mb: 3,
                                border: '4px solid white',
                                boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)'
                            }}
                        />
                        <Typography variant="h5" color="text.secondary" paragraph sx={{ fontStyle: 'italic', mb: 3 }}>
                            "{reviews[current].text}"
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            — {reviews[current].author}
                        </Typography>
                    </motion.div>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
                        {reviews.map((_: any, idx: number) => (
                            <Box
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: current === idx ? 'primary.main' : 'rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

// --- Feature Panel Block (Modern, distinct from Hero) ---
export const FeaturePanel: React.FC<BlockProps> = ({ content }) => {
    return (
        <Box sx={{ py: 10, bgcolor: '#fdfbf7' }}>
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                            <Box
                                component="img"
                                src={content.imageUrl}
                                alt={content.title}
                                sx={{
                                    width: '100%',
                                    height: '500px',
                                    objectFit: 'cover',
                                    borderRadius: '20px 0 20px 0', // Modern edgy definition
                                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
                                }}
                            />
                        </motion.div>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
                            <Typography variant="overline" color="secondary" fontWeight="bold" letterSpacing={2} gutterBottom>
                                CUSTOM COLLECTION
                            </Typography>
                            <Typography variant="h2" fontWeight={800} color="primary" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                                {content.title}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, fontWeight: 300, lineHeight: 1.8 }}>
                                {content.subtitle}
                            </Typography>
                            <Button
                                component={Link}
                                to={content.link || "/custom-soap"}
                                variant="contained"
                                size="large"
                                sx={{
                                    px: 6,
                                    py: 2,
                                    borderRadius: 0,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    boxShadow: 'none',
                                    fontSize: '1.1rem',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {content.buttonText || "Start Creating"}
                            </Button>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

// --- Main PageBlocks Component ---
export const PageBlocks: React.FC<{ layout: any[] }> = ({ layout }) => {
    // Use production API URL or localhost
    const apiBase = process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://herbal-soap-works-backend.fly.dev/api' : 'http://localhost:4000/api');

    if (!layout || !Array.isArray(layout)) return null;

    // Group adjacent hero blocks
    const renderedBlocks: React.ReactNode[] = [];
    let heroGroup: any[] = [];

    layout.forEach((block, index) => {
        if (block.type === 'hero') {
            heroGroup.push(block);
            // If next block is not hero or this is last block, render the group
            const nextBlock = layout[index + 1];
            if (!nextBlock || nextBlock.type !== 'hero') {
                renderedBlocks.push(<HeroCarousel key={`hero-group-${index}`} items={heroGroup} />);
                heroGroup = [];
            }
        } else {
            // Render other blocks normally
            switch (block.type) {
                case 'text': renderedBlocks.push(<TextBlock key={block.id} content={block.content} />); break;
                case 'image': renderedBlocks.push(<ImageBlock key={block.id} content={block.content} />); break;
                case 'feature-panel': renderedBlocks.push(<FeaturePanel key={block.id} content={block.content} />); break;
                case 'grid': renderedBlocks.push(<ProductGridBlock key={block.id} content={block.content} apiBase={apiBase} />); break;
                case 'testimonials': renderedBlocks.push(<TestimonialsBlock key={block.id} content={block.content} />); break;
                default: break;
            }
        }
    });

    return (
        <Box>
            {renderedBlocks}
        </Box>
    );
};

export default PageBlocks;
