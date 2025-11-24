import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LayoutEditor from '../components/LayoutEditor';

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
    const secret = localStorage.getItem('hsw_sb_secret');
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    else if (secret) headers['x-sb-secret'] = secret;
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
    const secret = localStorage.getItem('hsw_sb_secret');
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    else if (secret) headers['x-sb-secret'] = secret;
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
    const token = localStorage.getItem('hsw_token');
    const secret = localStorage.getItem('hsw_sb_secret');
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    else if (secret) headers['x-sb-secret'] = secret;
    const res = await fetch(`${apiBase}/api/products/${id}`, { method: 'DELETE', headers });
    if (res.ok) setProducts(products.filter((p) => p.id !== id));
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (!editing) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem('hsw_token');
    const secret = localStorage.getItem('hsw_sb_secret');
    const form = new FormData();
    form.append('file', file);
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    else if (secret) headers['x-sb-secret'] = secret;
    const res = await fetch(`${apiBase}/api/upload`, { method: 'POST', body: form, headers: Object.keys(headers).length ? headers : undefined });
    const j = await res.json();
    editing.imageUrl = j.url;
    setEditing({ ...editing });
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Admin Product Management</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Token is auto-injected from login (localStorage). To use the SB secret instead, set it in the browser console as <code>localStorage.setItem('hsw_sb_secret', 'YOUR_SECRET')</code>.</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => openEdit()}>Create Product</Button>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
        {products.map((p) => (
          <Paper key={p.id} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">{p.name}</Typography>
                <Typography variant="body2">{p.description}</Typography>
                <Typography variant="subtitle1">${p.price}</Typography>
              </Box>
              <Box>
                <IconButton onClick={() => openEdit(p)}><EditIcon /></IconButton>
                <IconButton onClick={() => remove(p.id)}><DeleteIcon /></IconButton>
                <Button size="small" onClick={() => openLayout(p)} sx={{ ml: 1 }}>Edit Layout</Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editing && editing.id > 0 ? 'Edit Product' : 'Create Product'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={editing?.name || ''} onChange={(e) => setEditing(editing ? { ...editing, name: e.target.value } : null)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Description" value={editing?.description || ''} onChange={(e) => setEditing(editing ? { ...editing, description: e.target.value } : null)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Price" type="number" value={editing?.price || 0} onChange={(e) => setEditing(editing ? { ...editing, price: Number(e.target.value) } : null)} sx={{ mb: 2 }} />
          <input type="file" onChange={uploadImage} />
          {editing?.imageUrl && <Box sx={{ mt: 2 }}><img src={editing.imageUrl} alt="preview" style={{ maxWidth: '100%' }} /></Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <LayoutEditor open={layoutOpen} initial={layoutProduct?.layout || null} onClose={() => setLayoutOpen(false)} onSave={saveLayout} apiBase={apiBase} />
    </Box>
  );
}
