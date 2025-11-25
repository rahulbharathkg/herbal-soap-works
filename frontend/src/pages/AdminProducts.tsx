import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Tooltip, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import LayoutEditor from '../components/LayoutEditor';
import ProductPlaceholder from '../components/ProductPlaceholder';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  cost?: number;
  imageUrl?: string;
  layout?: any;
};

export default function AdminProducts({ apiBase }: { apiBase: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [layoutProduct, setLayoutProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`${apiBase}/api/products`).then((r) => r.json()).then(setProducts).catch(console.error);
  }, [apiBase]);

  function openEdit(p?: Product) {
    setEditing(p ? { ...p } : { id: 0, name: '', description: '', price: 0 });
    setOpen(true);
  }

  function openLayout(p: Product) {
    setLayoutProduct(p);
    setLayoutOpen(true);
  }

  async function save() {
    if (!editing) return;
    const token = localStorage.getItem('hsw_token');
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (editing.id && editing.id > 0) {
      const res = await fetch(`${apiBase}/api/products/${editing.id}`, { method: 'PUT', headers, body: JSON.stringify(editing) });
      if (res.ok) setProducts(products.map((p) => (p.id === editing.id ? editing : p)));
    } else {
      const res = await fetch(`${apiBase}/api/products`, { method: 'POST', headers, body: JSON.stringify(editing) });
      if (res.ok) {
        const created = await res.json();
        setProducts([...products, created]);
      }
    }
    setOpen(false);
  }

  async function saveLayout(layout: any) {
    if (!layoutProduct) return;
    const token = localStorage.getItem('hsw_token');
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetch(`${apiBase}/api/products/${layoutProduct.id}`, { method: 'PUT', headers, body: JSON.stringify({ ...layoutProduct, layout }) });
      if (res.ok) {
        await res.json().catch(() => null);
        setProducts(products.map((p) => (p.id === layoutProduct.id ? { ...p, layout } : p)));
      }
      // record an event for analytics
      try {
        await fetch(`${apiBase}/api/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'layout_update', productId: layoutProduct.id, metadata: { note: 'layout saved by admin' } }) });
      } catch (err) { console.error('event error', err); }
    } finally {
      setLayoutOpen(false);
      setLayoutProduct(null);
    }
  }

  async function remove(id: number) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const token = localStorage.getItem('hsw_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${apiBase}/api/products/${id}`, { method: 'DELETE', headers });
    if (res.ok) setProducts(products.filter((p) => p.id !== id));
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (!editing) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem('hsw_token');
    const form = new FormData();
    form.append('file', file);
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${apiBase}/api/upload`, { method: 'POST', body: form, headers: Object.keys(headers).length ? headers : undefined });
    const j = await res.json();
    editing.imageUrl = j.url;
    setEditing({ ...editing });
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openEdit()}
          sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 600 }}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #eee' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fafafa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>
                  <Avatar
                    variant="rounded"
                    src={p.imageUrl}
                    sx={{ width: 56, height: 56, bgcolor: 'grey.100' }}
                  >
                    {!p.imageUrl && <ProductPlaceholder height="100%" text="" />}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                  {!p.imageUrl && <Chip label="No Image" size="small" color="warning" variant="outlined" sx={{ mt: 0.5, fontSize: '0.65rem', height: 20 }} />}
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                  <Typography variant="body2" color="text.secondary" noWrap>{p.description}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>${p.price.toFixed(2)}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit Layout">
                    <IconButton size="small" onClick={() => openLayout(p)} color="primary"><DashboardCustomizeIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Details">
                    <IconButton size="small" onClick={() => openEdit(p)} sx={{ ml: 1 }}><EditIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => remove(p.id)} color="error" sx={{ ml: 1 }}><DeleteIcon /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">No products found. Create one to get started.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>{editing && editing.id > 0 ? 'Edit Product' : 'Create Product'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Product Name"
              variant="outlined"
              value={editing?.name || ''}
              onChange={(e) => setEditing(editing ? { ...editing, name: e.target.value } : null)}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              variant="outlined"
              value={editing?.description || ''}
              onChange={(e) => setEditing(editing ? { ...editing, description: e.target.value } : null)}
            />
            <TextField
              fullWidth
              label="Price ($)"
              type="number"
              variant="outlined"
              value={editing?.price || 0}
              onChange={(e) => setEditing(editing ? { ...editing, price: Number(e.target.value) } : null)}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Product Image</Typography>
              <Button variant="outlined" component="label" fullWidth sx={{ height: 100, borderStyle: 'dashed' }}>
                {editing?.imageUrl ? 'Change Image' : 'Upload Image'}
                <input type="file" hidden onChange={uploadImage} accept="image/*" />
              </Button>
              {editing?.imageUrl && (
                <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                  <img src={editing.imageUrl} alt="preview" style={{ width: '100%', display: 'block' }} />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button onClick={save} variant="contained" sx={{ fontWeight: 600, px: 4 }}>Save Product</Button>
        </DialogActions>
      </Dialog>

      <LayoutEditor open={layoutOpen} initial={layoutProduct?.layout || null} onClose={() => setLayoutOpen(false)} onSave={saveLayout} apiBase={apiBase} />
    </Box>
  );
}
