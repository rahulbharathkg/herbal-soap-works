import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductPlaceholder from './ProductPlaceholder';
import { useCart } from '../context/CartContext';

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
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Card
                elevation={0}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 0,
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        border: '1px solid #2E3B29',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    },
                }}
            >
                <Box sx={{ position: 'relative', pt: '120%', overflow: 'hidden', bgcolor: '#f5f5f5' }}>
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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            padding: '16px',
                            pointerEvents: isHovered ? 'auto' : 'none',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(product);
                            }}
                            sx={{
                                borderRadius: 0,
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1.5,
                                bgcolor: '#2E3B29',
                                '&:hover': {
                                    bgcolor: '#1f2a1d',
                                }
                            }}
                        >
                            Add to Cart
                        </Button>
                    </motion.div>
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5, p: 2 }}>
                    <Typography variant="subtitle2" component="div" sx={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.4, color: '#2E3B29' }}>
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontSize: '0.85rem',
                        mb: 1,
                        minHeight: '2.4em'
                    }}>
                        {product.description || 'No description available.'}
                    </Typography>
                    <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2E3B29', fontSize: '1.1rem' }}>
                            ₹{product.price}
                        </Typography>
                        <Chip
                            label="In Stock"
                            size="small"
                            sx={{
                                height: 22,
                                fontSize: '0.7rem',
                                bgcolor: '#e8f5e9',
                                color: '#2E3B29',
                                border: 'none',
                                fontWeight: 600
                            }}
                        />
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
}
