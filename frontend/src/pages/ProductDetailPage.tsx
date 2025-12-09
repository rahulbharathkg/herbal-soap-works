// ProductDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Chip, CircularProgress, Paper, Divider, Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductPlaceholder from '../components/ProductPlaceholder';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  images?: string; // JSON string
}

export default function ProductDetailPage({ apiBase }: { apiBase: string }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const { addToCart } = useCart();

  const images = React.useMemo(() => {
    if (!product || !product.images) return [];
    try {
      return JSON.parse(product.images);
    } catch (e) {
      console.error('Failed to parse images JSON', e);
      return [];
    }
  }, [product]);

  useEffect(() => {
    fetch(`${apiBase}/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        if (data.images) {
          try {
            const imgs = JSON.parse(data.images);
            if (imgs.length > 0) setSelectedImage(imgs[0]);
            else setSelectedImage(data.imageUrl);
          } catch (e) {
            setSelectedImage(data.imageUrl);
          }
        } else {
          setSelectedImage(data.imageUrl);
        }
      })
      .catch(err => {
        console.error('Failed to fetch product:', err);
        // Do not redirect, show error state
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [apiBase, id, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 20, textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h2" sx={{ fontSize: '4rem', mb: 2 }}>🧼</Typography>
          <Typography variant="h4" color="text.secondary" gutterBottom fontWeight={700}>Product Not Found</Typography>
          <Typography variant="body1" mb={4} color="text.secondary">We couldn't find the soap you're looking for.</Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{ borderRadius: 50, px: 4, py: 1.5 }}
          >
            Browse All Soaps
          </Button>
        </motion.div>
      </Container>
    );
  }

  // Ensure main image is in the list
  if (product.imageUrl && !images.includes(product.imageUrl)) {
    images.unshift(product.imageUrl);
  }

  const heroIngredients = product.description.includes('Hero Ingredients:')
    ? product.description.split('Hero Ingredients:')[1]
    : 'All natural, locally sourced ingredients.';

  const cleanDescription = product.description.split('Hero Ingredients:')[0];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 4, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
        Back to Products
      </Button>

      <Grid container spacing={8}>
        {/* Product Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 4, mb: 2, bgcolor: '#f9f9f9', position: 'relative', paddingTop: '100%' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={selectedImage || ''}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </Paper>
            {images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                {images.map((img: string, idx: number) => (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={idx}>
                    <Box onClick={() => setSelectedImage(img)} sx={{
                      width: 80, height: 80, flexShrink: 0, borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
                      border: selectedImage === img ? '2px solid #2E3B29' : '2px solid transparent', opacity: selectedImage === img ? 1 : 0.6
                    }}>
                      <img src={img} alt={`thumb-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  </motion.div>
                ))}
              </Box>
            )}
          </motion.div>
        </Grid>

        {/* Product Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <Typography variant="h3" fontWeight={800} gutterBottom color="primary.main">{product.name}</Typography>
            <Chip label="In Stock" color="success" size="small" variant="filled" sx={{ mb: 3, borderRadius: 1 }} />

            <Typography variant="h4" color="secondary.main" fontWeight={700} gutterBottom>${product.price.toFixed(2)}</Typography>

            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary', mb: 4 }}>
              {cleanDescription}
            </Typography>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<ShoppingCartIcon />}
              onClick={() => addToCart(product)}
              sx={{ py: 2, fontSize: '1.1rem', borderRadius: 50, mb: 6, boxShadow: '0 8px 20px rgba(46, 59, 41, 0.2)' }}
            >
              Add to Cart
            </Button>

            <Divider sx={{ mb: 4 }} />

            {/* Modern Tabs */}
            <Box>
              <Tabs
                value={tabIndex}
                onChange={(e, v) => setTabIndex(v)}
                textColor="primary"
                indicatorColor="primary"
                sx={{ '& .MuiTab-root': { textTransform: 'none', fontSize: '1rem', fontWeight: 600 } }}
              >
                <Tab label="Ingredients" />
                <Tab label="Reviews" />
                <Tab label="Shipping" />
              </Tabs>
              <Box sx={{ py: 3, minHeight: 150 }}>
                <motion.div
                  key={tabIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {tabIndex === 0 && (
                    <Typography variant="body2" lineHeight={1.8} color="text.secondary">
                      <strong>Hero Ingredients:</strong> {heroIngredients} <br /><br />
                      We use only the finest natural oils, butters, and essential oils. No harsh chemicals, parabens, or sulfates.
                    </Typography>
                  )}
                  {tabIndex === 1 && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold" mr={1}>4.8</Typography>
                        <Typography variant="body2" color="text.secondary">/ 5.0 (Based on 12 reviews)</Typography>
                      </Box>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', mb: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">Sarah J.</Typography>
                        <Typography variant="caption" color="text.secondary">Verified Buyer</Typography>
                        <Typography variant="body2" mt={1}>"Simply the best soap I've ever used. The smell is divine!"</Typography>
                      </Paper>
                    </Box>
                  )}
                  {tabIndex === 2 && (
                    <Typography variant="body2" lineHeight={1.8} color="text.secondary">
                      Free shipping on orders over $50.<br />
                      Standard delivery: 3-5 business days.<br />
                      Returns accepted within 30 days of purchase.
                    </Typography>
                  )}
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
}
