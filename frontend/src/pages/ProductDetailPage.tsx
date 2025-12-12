// ProductDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Chip, CircularProgress, Paper, Divider, Tabs, Tab } from '@mui/material';
// import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  images?: string; // JSON string
}

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>Something went wrong.</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{this.state.error?.message}</Typography>
          <Button variant="outlined" onClick={() => window.location.reload()}>Reload Page</Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Image Mapping for Robust Testing (Fallback for DB)
const PRODUCT_IMAGE_MAP: Record<string, { imageUrl: string, images: string[] }> = {
  'Coffee Honey Soap': {
    imageUrl: '/images/products/coffee honey/coffee honey 1.png',
    images: ['/images/products/coffee honey/coffee honey 1.png', '/images/products/coffee honey/coffee honey card.png']
  },
  'Tan Removal Soap': {
    imageUrl: '/images/products/tan removal soap/tan 1.png',
    images: ['/images/products/tan removal soap/tan 1.png', '/images/products/tan removal soap/tan card.png']
  },
  'Red Wine Soap': {
    imageUrl: '/images/products/red wine soap/redwine 1.jpg',
    images: ['/images/products/red wine soap/redwine 1.jpg', '/images/products/red wine soap/redwine card.png']
  },
  'Sandalwood Soap': {
    imageUrl: '/images/products/sandalwood soap/sandalwood 1.PNG',
    images: ['/images/products/sandalwood soap/sandalwood 1.PNG', '/images/products/sandalwood soap/sandalwood card.PNG']
  }
};

const INGREDIENT_IMAGES: Record<string, string> = {
  'Coffee': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=150&q=80',
  'Honey': 'https://images.unsplash.com/photo-1587049352851-8d4e89186eff?auto=format&fit=crop&w=150&q=80',
  'Goat Milk': 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=150&q=80',
  'Red Wine': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=150&q=80',
  'Sandalwood': 'https://plus.unsplash.com/premium_photo-1675271813132-723a1c5d0016?auto=format&fit=crop&w=150&q=80',
  'Charcoal': 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=150&q=80',
  'Aloe Vera': 'https://images.unsplash.com/photo-1567683633890-448cb5a3cb5b?auto=format&fit=crop&w=150&q=80',
  'Almond Oil': 'https://images.unsplash.com/photo-1617424682055-6b5cf0d080f5?auto=format&fit=crop&w=150&q=80',
  'Niacinamide': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80',
};

function VisualIngredients({ description }: { description: string }) {
  if (!description.includes('Hero Ingredients:')) return null;
  const parts = description.split('Hero Ingredients:')[1].split(',').map(s => s.trim().split('(')[0].trim());

  return (
    <Box sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>Key Ingredients</Typography>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {parts.map(ing => {
          const img = Object.keys(INGREDIENT_IMAGES).find(k => ing.includes(k));
          if (!img) return null;
          return (
            <Box key={ing} sx={{ textAlign: 'center' }}>
              <Box
                component="img"
                src={INGREDIENT_IMAGES[img]}
                alt={ing}
                sx={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', mb: 1, border: '2px solid #eee' }}
              />
              <Typography variant="caption" display="block" fontWeight={600} sx={{ maxWidth: 80 }}>{ing}</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// Minimal Related Products Component
function RelatedProducts({ currentId, apiBase }: { currentId: number, apiBase: string }) {
  const [related, setRelated] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiBase}/products?limit=6`)
      .then(r => r.json())
      .then(d => {
        const other = (d.products || []).filter((p: Product) => p.id !== currentId)
        setRelated(other.slice(0, 3)); // Take top 3
      })
      .catch(() => { });
  }, [apiBase, currentId]);

  if (!related.length) return null;

  return (
    <Box sx={{ mt: 8, pt: 8, borderTop: '1px solid #eee' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom mb={4}>You Might Also Like</Typography>
      <Grid container spacing={4}>
        {related.map(p => (
          <Grid size={{ xs: 12, sm: 4 }} key={p.id}>
            <Box sx={{ cursor: 'pointer' }} onClick={() => navigate(`/products/${p.id}`)}>
              <Paper elevation={0} sx={{ bgcolor: '#f5f5f5', pt: '100%', position: 'relative', mb: 2, borderRadius: 2 }}>
                <img
                  src={p.imageUrl || '/images/home/logo.jpg'}
                  alt={p.name}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                />
              </Paper>
              <Typography variant="h6" fontWeight={600}>{p.name}</Typography>
              <Typography color="secondary" fontWeight={700}>₹{p.price}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function ProductDetailContent({ apiBase }: { apiBase: string }) {
  const { id } = useParams<{ id: string }>();
  // ... (rest of the component logic) ...
  // Keeping existing logic but moved inside this inner component
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const { addToCart } = useCart();
  const [mappedImages, setMappedImages] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${apiBase}/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        // Enforce Local Image Mapping
        if (PRODUCT_IMAGE_MAP[data.name]) {
          data.imageUrl = PRODUCT_IMAGE_MAP[data.name].imageUrl;
          data.images = JSON.stringify(PRODUCT_IMAGE_MAP[data.name].images);
        }

        setProduct(data);

        let imgs: string[] = [];
        if (data.images) {
          try {
            imgs = JSON.parse(data.images);
            if (Array.isArray(imgs) && imgs.length > 0) {
              // Good
            } else {
              imgs = [data.imageUrl];
            }
          } catch (e) {
            imgs = [data.imageUrl];
          }
        } else {
          imgs = [data.imageUrl];
        }

        // Ensure unique
        imgs = Array.from(new Set(imgs));
        setMappedImages(imgs);
        setSelectedImage(imgs[0]);
      })
      .catch(err => {
        console.error('Failed to fetch product:', err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [apiBase, id]);

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
        <Box sx={{ animation: 'fadeIn 1s' }}>
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
        </Box>
      </Container>
    );
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
          <Box sx={{ opacity: 1, transform: 'scale(1)', transition: '0.5s' }}>
            <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 4, mb: 2, bgcolor: '#f9f9f9', position: 'relative', paddingTop: '100%' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <img
                  src={selectedImage || ''}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </Paper>
            {mappedImages.length > 1 && (
              <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                {mappedImages.map((img: string, idx: number) => (
                  <Box key={idx} sx={{ transition: '0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
                    <Box onClick={() => setSelectedImage(img)} sx={{
                      width: 80, height: 80, flexShrink: 0, borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
                      border: selectedImage === img ? '2px solid #2E3B29' : '2px solid transparent', opacity: selectedImage === img ? 1 : 0.6
                    }}>
                      <img src={img} alt={`thumb-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ opacity: 1, transform: 'translateX(0)', transition: '0.5s' }}>
            <Typography variant="h3" fontWeight={800} gutterBottom color="primary.main">{product.name}</Typography>
            <Chip label="In Stock" color="success" size="small" variant="filled" sx={{ mb: 3, borderRadius: 1 }} />

            <Typography variant="h4" color="secondary.main" fontWeight={700} gutterBottom>₹{Number(product.price).toFixed(2)}</Typography>

            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary', mb: 2 }}>
              {cleanDescription}
            </Typography>

            {/* Visual Ingredients */}
            <VisualIngredients description={product.description} />

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
                <Box
                  key={tabIndex}
                  sx={{ animation: 'fadeIn 0.5s' }}
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
                      Free shipping on orders over ₹500.<br />
                      Standard delivery: 3-5 business days.<br />
                      Returns accepted within 30 days of purchase.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <RelatedProducts currentId={Number(id)} apiBase={apiBase} />

    </Container>
  );
}

export default function ProductDetailPage(props: any) {
  return (
    <ErrorBoundary>
      <ProductDetailContent {...props} />
    </ErrorBoundary>
  );
}
