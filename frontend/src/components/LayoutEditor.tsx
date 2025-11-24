import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField, Typography, IconButton } from '@mui/material';
import { motion, Reorder } from 'framer-motion';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

type Block = {
  id: string;
  type: 'text' | 'image' | 'columns';
  content?: string;
  imageUrl?: string;
  width?: number; // for columns
  animation?: 'none' | 'fade' | 'slide' | 'zoom';
};

export default function LayoutEditor({
  open,
  initial,
  onClose,
  onSave,
  apiBase,
}: {
  open: boolean;
  initial?: { blocks?: Block[] } | null;
  onClose: () => void;
  onSave: (layout: any) => void;
  apiBase: string;
}) {
  const [blocks, setBlocks] = useState<Block[]>(initial?.blocks || []);

  function addBlock(type: Block['type']) {
    const b: Block = { id: String(Date.now()) + Math.random().toString(36).slice(2, 6), type, animation: 'none' };
    if (type === 'text') b.content = 'New text';
    if (type === 'image') b.imageUrl = '';
    if (type === 'columns') { b.content = 'Column content'; b.width = 50; }
    setBlocks([...blocks, b]);
  }

  function updateBlock(id: string, patch: Partial<Block>) {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function move(id: string, dir: 'up' | 'down') {
    const i = blocks.findIndex((b) => b.id === id);
    if (i < 0) return;
    const arr = [...blocks];
    const j = dir === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= arr.length) return;
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    setBlocks(arr);
  }

  function remove(id: string) {
    setBlocks(blocks.filter((b) => b.id !== id));
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Layout Editor</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Add Block</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button variant="outlined" onClick={() => addBlock('text')}>Text</Button>
                <Button variant="outlined" onClick={() => addBlock('image')}>Image</Button>
                <Button variant="outlined" onClick={() => addBlock('columns')}>Columns</Button>
              </Box>
            </Box>

            {/* draggable/reorderable list using Framer Motion Reorder */}
            {/** Note: using value objects directly for simplicity */}
            <Reorder.Group axis="y" values={blocks} onReorder={(v: Block[]) => setBlocks(v as Block[])}>
              {blocks.map((b) => (
                <Reorder.Item key={b.id} value={b}>
                <Box sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DragIndicatorIcon sx={{ cursor: 'grab', color: 'text.secondary' }} />
                    <Typography variant="subtitle2">{b.type} block</Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => move(b.id, 'up')}><ArrowUpwardIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => move(b.id, 'down')}><ArrowDownwardIcon fontSize="small" /></IconButton>
                    <Button color="error" onClick={() => remove(b.id)}>Remove</Button>
                  </Box>
                </Box>

                {b.type === 'text' && (
                  <TextField fullWidth multiline value={b.content || ''} onChange={(e) => updateBlock(b.id, { content: e.target.value })} sx={{ mt: 1 }} />
                )}

                {b.type === 'image' && (
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField fullWidth label="Image URL" value={b.imageUrl || ''} onChange={(e) => updateBlock(b.id, { imageUrl: e.target.value })} />
                    <Button variant="outlined" onClick={() => {
                      // trigger file selector
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = async (ev: any) => {
                        const file = ev.target.files?.[0];
                        if (!file) return;
                        const form = new FormData();
                        form.append('file', file);
                        const token = localStorage.getItem('hsw_token');
                        const secret = localStorage.getItem('hsw_sb_secret');
                        const headers: any = {};
                        if (token) headers['Authorization'] = `Bearer ${token}`;
                        else if (secret) headers['x-sb-secret'] = secret;
                        try {
                          const res = await fetch(`${apiBase}/api/upload`, { method: 'POST', body: form, headers: Object.keys(headers).length ? headers : undefined });
                          const j = await res.json();
                          updateBlock(b.id, { imageUrl: j.url });
                        } catch (err) {
                          console.error('upload error', err);
                        }
                      };
                      input.click();
                    }}>Upload</Button>
                  </Box>
                )}

                {b.type === 'columns' && (
                  <TextField fullWidth label="Column text" value={b.content || ''} onChange={(e) => updateBlock(b.id, { content: e.target.value })} sx={{ mt: 1 }} />
                )}

                <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                  <Typography variant="caption">Animation:</Typography>
                  <Select value={b.animation || 'none'} onChange={(e) => updateBlock(b.id, { animation: e.target.value as any })} size="small">
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="fade">Fade</MenuItem>
                    <MenuItem value="slide">Slide</MenuItem>
                    <MenuItem value="zoom">Zoom</MenuItem>
                  </Select>
                </Box>
                </Box>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </Box>

          <Box sx={{ width: 360 }}>
            <Typography variant="subtitle2">Preview</Typography>
            <Box sx={{ mt: 1, border: '1px solid #eee', p: 2, borderRadius: 1, minHeight: 240 }}>
              {blocks.map((b) => {
                const animProps: any = {};
                if (b.animation === 'fade') { animProps.initial = { opacity: 0 }; animProps.animate = { opacity: 1 }; }
                if (b.animation === 'slide') { animProps.initial = { x: -30, opacity: 0 }; animProps.animate = { x: 0, opacity: 1 }; }
                if (b.animation === 'zoom') { animProps.initial = { scale: 0.9, opacity: 0 }; animProps.animate = { scale: 1, opacity: 1 }; }
                return (
                  <motion.div key={b.id} {...animProps} transition={{ duration: 0.4 }} style={{ marginBottom: 12 }}>
                    {b.type === 'text' && <Typography>{b.content}</Typography>}
                    {b.type === 'image' && b.imageUrl && <img src={b.imageUrl} alt="block" style={{ maxWidth: '100%' }} />}
                    {b.type === 'columns' && <Typography>{b.content}</Typography>}
                  </motion.div>
                );
              })}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave({ blocks })}>Save Layout</Button>
      </DialogActions>
    </Dialog>
  );
}
