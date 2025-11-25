import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductPlaceholder from './ProductPlaceholder';

export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
};

interface ProductCardProps {
    product: Product;
    onView?: (p: Product) => void;
}

export default function ProductCard({ product, onView }: ProductCardProps) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <Card
                elevation={0}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                    },
                }}
            >
                <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden' }}>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                        {product.imageUrl ? (
                            <CardMedia
                                component="img"
                                image={product.imageUrl}
                                alt={product.name}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <ProductPlaceholder height="100%" />
                        )}
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            p: 2,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                            display: 'flex',
                            justifyContent: 'center',
                            '.MuiCard-root:hover &': { opacity: 1 },
                        }}
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            component={Link}
                            to={`/products/${product.id}`}
                            onClick={() => onView?.(product)}
                            sx={{ borderRadius: 20, textTransform: 'none', fontWeight: 600 }}
                        >
                            View Details
                        </Button>
                    </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.3 }}>
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 1
                    }}>
                        {product.description || 'No description available.'}
                    </Typography>
                    <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
                            ${product.price.toFixed(2)}
                        </Typography>
                        <Chip label="In Stock" size="small" color="success" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
}
