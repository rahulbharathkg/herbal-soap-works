import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProductCard, { Product } from '../components/ProductCard';

export default function ProductsPage({ apiBase }: { apiBase: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  // const location = useLocation();
  const [loading, setLoading] = useState(true);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [minPrice, setMinPrice] = useState('');
  // const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // Define unused vars to satisfy linter if needed or just comment usages
  const searchTerm = '';
  const minPrice = '';
  const maxPrice = '';

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      search: searchTerm,
      minPrice: minPrice === '' ? '0' : minPrice,
      maxPrice: maxPrice === '' ? '1000000' : maxPrice,
      page: page.toString(),
      limit: limit.toString()
    });

    fetch(`${apiBase}/products?${query}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalPages(Math.ceil(data.total / limit));

          // send view events for each product loaded
          try {
            for (const prod of data.products) {
              fetch(`${apiBase}/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'view', productId: prod.id }) }).catch(() => { });
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
    // record click and open detail
    fetch(`${apiBase}/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'click', productId: p.id }) }).catch(() => { });
    navigate(`/products/${p.id}`);
  }

  // Client-side filtering removed in favor of server-side
  const filteredProducts = products;

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
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
