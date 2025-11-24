import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

type Product = { id: number; name: string; description: string; price: number; imageUrl?: string };

export default function ProductsPage({ apiBase }: { apiBase: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${apiBase}/api/products`).then((r) => r.json()).then((p: Product[]) => {
      setProducts(p || []);
      // send view events for each product loaded
      try {
        for (const prod of p || []) {
          fetch(`${apiBase}/api/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'view', productId: prod.id }) }).catch(() => {});
        }
      } catch (e) { /* ignore */ }
    }).catch(console.error);
  }, [apiBase]);

  function onClickProduct(p: Product) {
    // record click and open detail (for now just log)
    fetch(`${apiBase}/api/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'click', productId: p.id }) }).catch(() => {});
    alert(`Clicked ${p.name}`);
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Products</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 16 }}>
        {products.map((p) => (
          <Paper key={p.id} sx={{ p: 2 }}>
            <Typography variant="h6">{p.name}</Typography>
            <Typography variant="body2">{p.description}</Typography>
            <Typography sx={{ mt: 1 }}>${p.price}</Typography>
            {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ maxWidth: '100%', marginTop: 8 }} />}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={() => onClickProduct(p)}>View</Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
