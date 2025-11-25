import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';
import ProductCard, { Product } from '../components/ProductCard';

export default function ProductsPage({ apiBase }: { apiBase: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${apiBase}/api/products`).then((r) => r.json()).then((p: Product[]) => {
      setProducts(p || []);
      // send view events for each product loaded
      try {
        for (const prod of p || []) {
          fetch(`${apiBase}/api/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'view', productId: prod.id }) }).catch(() => { });
        }
      } catch (e) { /* ignore */ }
    }).catch(console.error);
  }, [apiBase]);

  function onClickProduct(p: Product) {
    // record click and open detail (for now just log)
    fetch(`${apiBase}/api/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'click', productId: p.id }) }).catch(() => { });
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Box sx={{
        bgcolor: '#f3e5f5',
        py: 8,
        px: 2,
        mb: 6,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'
      }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" component="h1" sx={{ fontWeight: 800, color: '#4a148c', mb: 2 }}>
              Our Collection
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              Handcrafted with love, nature, and science. Explore our premium range of herbal soaps.
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for soaps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { bgcolor: 'white', borderRadius: 4 }
              }}
              sx={{ maxWidth: 500 }}
            />
          </motion.div>
        </Container>
      </Box>

      {/* Product Grid */}
      <Container maxWidth="lg">
        {filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No products found matching your search.</Typography>
          </Box>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 4
          }}>
            {filteredProducts.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ProductCard product={p} onView={onClickProduct} />
              </motion.div>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
