import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Container, Grid, Chip, Divider, Rating } from '@mui/material';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductPlaceholder from '../components/ProductPlaceholder';

type Block = {
  id: string;
  type: 'text' | 'image' | 'columns';
  content?: string;
  imageUrl?: string;
  width?: number; // for columns
  animation?: 'none' | 'fade' | 'slide' | 'zoom';
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  layout?: { blocks?: Block[] };
};

export default function ProductDetailPage({ apiBase }: { apiBase: string }) {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`${apiBase}/api/products/${id}`)
        .then((r) => r.json())
        .then((p: Product) => {
          setProduct(p);
          setLoading(false);
        })
        .catch(() => {
          setProduct(null);
          setLoading(false);
        });
    }
  }, [apiBase, id]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><CircularProgress /></Box>;
  }

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Product not found</Typography>
        <Typography color="text.secondary">The product you are looking for does not exist or has been removed.</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Left Column: Image Gallery */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                bgcolor: 'white',
                position: 'relative',
                aspectRatio: '1/1'
              }}>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <ProductPlaceholder height="100%" text="No Image Available" />
                )}
              </Box>
            </motion.div>
          </Grid>

          {/* Right Column: Product Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box>
                <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
                  HERBAL SOAP WORKS
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#1a1a1a' }}>
                  {product.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Rating value={4.5} readOnly precision={0.5} />
                  <Typography variant="body2" color="text.secondary">(24 reviews)</Typography>
                </Box>

                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700, mb: 3 }}>
                  ${product.price.toFixed(2)}
                </Typography>

                <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: 'text.primary' }}>
                  {product.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    sx={{
                      flexGrow: 1,
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      boxShadow: '0 8px 20px rgba(74, 20, 140, 0.3)'
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
                  >
                    Wishlist
                  </Button>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Highlights</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label="Organic" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
                    <Chip label="Handmade" size="small" sx={{ bgcolor: '#fff3e0', color: '#ef6c00', fontWeight: 600 }} />
                    <Chip label="Cruelty Free" size="small" sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2', fontWeight: 600 }} />
                  </Box>
                </Box>

                {/* Custom Layout Blocks if any */}
                {product.layout && product.layout.blocks && product.layout.blocks.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>More Details</Typography>
                    {product.layout.blocks.map((b) => (
                      <Box key={b.id} sx={{ mb: 2 }}>
                        {b.type === 'text' && <Typography variant="body2" color="text.secondary">{b.content}</Typography>}
                        {b.type === 'image' && b.imageUrl && (
                          <Box sx={{ borderRadius: 2, overflow: 'hidden', mt: 1 }}>
                            <img src={b.imageUrl} alt="detail" style={{ maxWidth: '100%' }} />
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
