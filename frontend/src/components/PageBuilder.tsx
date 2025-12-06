import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography, IconButton, Grid, Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';

interface PageBuilderProps {
    token: string;
    baseUrl: string;
    showMessage: (msg: { type: string, text: string }) => void;
}

export default function PageBuilder({ token, baseUrl, showMessage }: PageBuilderProps) {
    const [layout, setLayout] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [editingBlock, setEditingBlock] = useState<any>(null);

    useEffect(() => {
        console.log('PageBuilder fetching:', `${baseUrl}/admin/content`);
        fetch(`${baseUrl}/admin/content`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.home_layout) {
                    try {
                        setLayout(JSON.parse(data.home_layout));
                    } catch (e) {
                        setLayout([]);
                    }
                }
            })
            .catch(err => {
                console.error('Failed to fetch layout', err);
                showMessage({ type: 'error', text: 'Failed to load layout' });
            });
    }, [baseUrl, token]);

    const saveLayout = async (newLayout: any[]) => {
        setLayout(newLayout);
        try {
            console.log('PageBuilder saving to:', `${baseUrl}/admin/content`);
            const res = await fetch(`${baseUrl}/admin/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ home_layout: JSON.stringify(newLayout) })
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            showMessage({ type: 'success', text: 'Layout saved' });
        } catch (e) {
            console.error('Save failed', e);
            showMessage({ type: 'error', text: 'Error saving layout' });
        }
    };

    const moveBlock = (index: number, direction: number) => {
        const newLayout = [...layout];
        const [moved] = newLayout.splice(index, 1);
        newLayout.splice(index + direction, 0, moved);
        saveLayout(newLayout);
    };

    const deleteBlock = (index: number) => {
        if (!window.confirm('Delete this block?')) return;
        const newLayout = layout.filter((_, i) => i !== index);
        saveLayout(newLayout);
    };

    const addBlock = (type: string) => {
        const newBlock = {
            id: Date.now().toString(),
            type,
            content: getDefaultContent(type)
        };
        saveLayout([...layout, newBlock]);
    };

    const updateBlockContent = (content: any) => {
        const newLayout = layout.map(b => b.id === editingBlock.id ? { ...b, content } : b);
        saveLayout(newLayout);
        setEditingBlock(null);
        setOpen(false);
    };

    return (
        <Box>
            <Box display="flex" gap={2} mb={4}>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => addBlock('hero')}>Add Hero</Button>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => addBlock('text')}>Add Text</Button>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => addBlock('product-grid')}>Add Product Grid</Button>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => addBlock('image')}>Add Image</Button>
            </Box>

            <Grid container spacing={2}>
                {layout.map((block, index) => (
                    <Grid size={{ xs: 12 }} key={block.id}>
                        <Card variant="outlined" sx={{ bgcolor: '#f5f5f5' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle1" fontWeight="bold">{block.type.toUpperCase()}</Typography>
                                    <Box>
                                        <IconButton disabled={index === 0} onClick={() => moveBlock(index, -1)}><ArrowUpwardIcon /></IconButton>
                                        <IconButton disabled={index === layout.length - 1} onClick={() => moveBlock(index, 1)}><ArrowDownwardIcon /></IconButton>
                                        <Button size="small" onClick={() => { setEditingBlock(block); setOpen(true); }}>Edit</Button>
                                        <IconButton color="error" onClick={() => deleteBlock(index)}><DeleteIcon /></IconButton>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="textSecondary" noWrap>{JSON.stringify(block.content)}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {editingBlock && (
                <BlockEditor
                    open={open}
                    onClose={() => setOpen(false)}
                    block={editingBlock}
                    onSave={updateBlockContent}
                />
            )}
        </Box>
    );
}

function getDefaultContent(type: string) {
    switch (type) {
        case 'hero': return { title: 'New Hero', subtitle: 'Subtitle here', imageUrl: 'https://via.placeholder.com/1200x600' };
        case 'text': return { text: 'New Text Block', align: 'center', variant: 'body1' };
        case 'product-grid': return { limit: 4 };
        case 'image': return { imageUrl: 'https://via.placeholder.com/800x400' };
        default: return {};
    }
}

function BlockEditor({ open, onClose, block, onSave }: any) {
    const [content, setContent] = useState(block.content);

    useEffect(() => setContent(block.content), [block]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit {block.type}</DialogTitle>
            <DialogContent>
                {block.type === 'hero' && (
                    <>
                        <TextField fullWidth label="Title" margin="normal" value={content.title} onChange={e => setContent({ ...content, title: e.target.value })} />
                        <TextField fullWidth label="Subtitle" margin="normal" value={content.subtitle} onChange={e => setContent({ ...content, subtitle: e.target.value })} />
                        <TextField fullWidth label="Image URL" margin="normal" value={content.imageUrl} onChange={e => setContent({ ...content, imageUrl: e.target.value })} />
                    </>
                )}
                {block.type === 'text' && (
                    <>
                        <TextField fullWidth label="Text" margin="normal" multiline rows={4} value={content.text} onChange={e => setContent({ ...content, text: e.target.value })} />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Alignment</InputLabel>
                            <Select value={content.align || 'left'} label="Alignment" onChange={e => setContent({ ...content, align: e.target.value })}>
                                <MenuItem value="left">Left</MenuItem>
                                <MenuItem value="center">Center</MenuItem>
                                <MenuItem value="right">Right</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Variant</InputLabel>
                            <Select value={content.variant || 'body1'} label="Variant" onChange={e => setContent({ ...content, variant: e.target.value })}>
                                <MenuItem value="h1">Heading 1</MenuItem>
                                <MenuItem value="h2">Heading 2</MenuItem>
                                <MenuItem value="h3">Heading 3</MenuItem>
                                <MenuItem value="body1">Body</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                )}
                {block.type === 'product-grid' && (
                    <TextField fullWidth label="Limit" type="number" margin="normal" value={content.limit} onChange={e => setContent({ ...content, limit: Number(e.target.value) })} />
                )}
                {block.type === 'image' && (
                    <TextField fullWidth label="Image URL" margin="normal" value={content.imageUrl} onChange={e => setContent({ ...content, imageUrl: e.target.value })} />
                )}
                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => onSave(content)}>Save</Button>
            </DialogContent>
        </Dialog>
    );
}
