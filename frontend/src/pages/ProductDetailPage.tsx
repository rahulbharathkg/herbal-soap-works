import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Chip, CircularProgress, Paper } from '@mui/material';
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
}

export default function ProductDetailPage({ apiBase }: { apiBase: string }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${apiBase}/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(err => {
        console.error(err);
        navigate('/products'); // Redirect if not found
      })
      .finally(() => setLoading(false));
  }, [apiBase, id, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4 }}
      >
        Back to Products
      </Button>

      <Grid container spacing={6}>
        {/* Image Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                bgcolor: '#f5f5f5',
                position: 'relative',
                paddingTop: '100%' // 1:1 Aspect Ratio
              }}
            >
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <ProductPlaceholder height="100%" />
                )}
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Details Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, color: '#2c3e50' }}>
                {product.name}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Chip label="In Stock" color="success" variant="outlined" size="small" />
              </Box>

              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700, mb: 4 }}>
                ${product.price.toFixed(2)}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 6, lineHeight: 1.8, fontSize: '1.1rem' }}>
                {product.description}
              </Typography>

              <Box sx={{ mt: 'auto' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  fullWidth
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 8px 20px rgba(74, 20, 140, 0.2)'
                  }}
                  onClick={() => {
                    addToCart(product);
                  }}
                >
                  Add to Cart
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
}
