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
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 20, textAlign: 'center' }}>
        <Typography variant="h4" color="text.secondary" gutterBottom>Product Not Found</Typography>
        <Typography variant="body1" mb={4}>The product you are looking for does not exist or has been removed.</Typography>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')}>Browse Products</Button>
      </Container>
    );
  }

  const images = product.images ? JSON.parse(product.images) : [];
  if (product.imageUrl && !images.includes(product.imageUrl)) {
    images.unshift(product.imageUrl);
  }

  const heroIngredients = product.description.includes('Hero Ingredients:')
    ? product.description.split('Hero Ingredients:')[1]
    : 'All natural, locally sourced ingredients.';

  const cleanDescription = product.description.split('Hero Ingredients:')[0];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 4 }}>
        Back
      </Button>

      <Grid container spacing={8}>
        {/* Product Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 4, mb: 2, bgcolor: '#f5f5f5', position: 'relative', paddingTop: '100%' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {selectedImage ? (
                  <img src={selectedImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : <ProductPlaceholder height="100%" />}
              </Box>
            </Paper>
            {images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                {images.map((img: string, idx: number) => (
                  <Box key={idx} onClick={() => setSelectedImage(img)} sx={{
                    width: 80, height: 80, flexShrink: 0, borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
                    border: selectedImage === img ? '2px solid #2E3B29' : '2px solid transparent', opacity: selectedImage === img ? 1 : 0.6
                  }}>
                    <img src={img} alt={`thumb-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Box>
            )}
          </motion.div>
        </Grid>

        {/* Product Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Typography variant="h3" fontWeight={800} gutterBottom color="#2c3e50">{product.name}</Typography>
            <Chip label="In Stock" color="success" size="small" variant="outlined" sx={{ mb: 3 }} />

            <Typography variant="h4" color="primary.main" fontWeight={700} gutterBottom>${product.price.toFixed(2)}</Typography>

            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary', mb: 4 }}>
              {cleanDescription}
            </Typography>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<ShoppingCartIcon />}
              onClick={() => addToCart(product)}
              sx={{ py: 2, fontSize: '1.1rem', borderRadius: 0, mb: 6 }}
            >
              Add to Cart
            </Button>

            <Divider />

            {/* Modern Tabs */}
            <Box sx={{ mt: 4 }}>
              <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} textColor="primary" indicatorColor="primary">
                <Tab label="Ingredients" />
                <Tab label="Reviews" />
                <Tab label="Shipping" />
              </Tabs>
              <Box sx={{ py: 3 }}>
                {tabIndex === 0 && (
                  <Typography variant="body2" lineHeight={1.8}>
                    <strong>Key Ingredients:</strong> {heroIngredients} <br /><br />
                    We use only the finest natural oils, butters, and essential oils. No harsh chemicals, parabens, or sulfates.
                  </Typography>
                )}
                {tabIndex === 1 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>⭐⭐⭐⭐⭐ (3 Reviews)</Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', mb: 1 }}>
                      <Typography variant="caption" fontWeight="bold">Sarah J.</Typography>
                      <Typography variant="body2">"Simply the best soap I've ever used."</Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                      <Typography variant="caption" fontWeight="bold">Mike T.</Typography>
                      <Typography variant="body2">"Smells amazing!"</Typography>
                    </Paper>
                  </Box>
                )}
                {tabIndex === 2 && (
                  <Typography variant="body2" lineHeight={1.8}>
                    Free shipping on orders over $50.<br />
                    Standard delivery: 3-5 business days.<br />
                    Returns accepted within 30 days of purchase.
                  </Typography>
                )}
              </Box>
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
}
