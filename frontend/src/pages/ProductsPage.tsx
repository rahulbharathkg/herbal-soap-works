import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';
import ProductCard, { Product } from '../components/ProductCard';

export default function ProductsPage({ apiBase }: { apiBase: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      search: searchTerm,
      minPrice: minPrice || '0',
      maxPrice: maxPrice || '1000000',
      page: page.toString(),
      limit: limit.toString()
    });

    fetch(`${apiBase}/api/products?${query}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalPages(Math.ceil(data.total / limit));

          // send view events for each product loaded
          try {
            for (const prod of data.products) {
              fetch(`${apiBase}/api/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'view', productId: prod.id }) }).catch(() => { });
            }
          } catch (e) { /* ignore */ }
        }
      })
      .catch((error) => {
        console.error('API failed:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiBase, searchTerm, minPrice, maxPrice, page]);

  function onClickProduct(p: Product) {
    // record click and open detail (for now just log)
    fetch(`${apiBase}/api/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'click', productId: p.id }) }).catch(() => { });
  }

  // Client-side filtering removed in favor of server-side
  const filteredProducts = products;

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
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <TextField
                variant="outlined"
                placeholder="Search soaps..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { bgcolor: 'white', borderRadius: 4 }
                }}
                sx={{ minWidth: 300 }}
              />
              <TextField
                variant="outlined"
                placeholder="Min Price"
                type="number"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                InputProps={{ sx: { bgcolor: 'white', borderRadius: 4 } }}
                sx={{ width: 120 }}
              />
              <TextField
                variant="outlined"
                placeholder="Max Price"
                type="number"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                InputProps={{ sx: { bgcolor: 'white', borderRadius: 4 } }}
                sx={{ width: 120 }}
              />
            </Box>
          </motion.div>
        </Container>
      </Box>



      <Container maxWidth="lg">
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">Loading products...</Typography>
          </Box>
        ) : filteredProducts.length === 0 ? (
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

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            sx={{ mr: 2 }}
          >
            Previous
          </Button>
          <Typography sx={{ alignSelf: 'center' }}>
            Page {page} of {totalPages}
          </Typography>
          <Button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            sx={{ ml: 2 }}
          >
            Next
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
