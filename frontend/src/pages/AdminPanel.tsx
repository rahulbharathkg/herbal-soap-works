import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, TextField, Button, Paper, Grid,
    Snackbar, Alert, Tabs, Tab, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, Card, CardMedia, CardContent,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useNavigate } from 'react-router-dom';

import PageBuilder from '../components/PageBuilder';

interface AdminDashboardProps {
    apiBase?: string;
}

export default function AdminDashboard({ apiBase }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState(0);
    const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const BASE_URL = apiBase || process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';
    console.log('AdminDashboard API Base:', BASE_URL);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('adminToken', data.token);
                setToken(data.token);
                setMessage({ type: 'success', text: 'Logged in successfully' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Login failed' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error' });
        }
    };

    if (!token) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>Admin Login</Typography>
                    <form onSubmit={handleLogin}>
                        <TextField fullWidth label="Username" margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
                        <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Login</Button>
                    </form>
                </Paper>
                {message.text && <Snackbar open autoHideDuration={6000} onClose={() => setMessage({ type: '', text: '' })}><Alert severity={message.type as any}>{message.text}</Alert></Snackbar>}
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4">Admin Dashboard</Typography>
                <Button onClick={() => { localStorage.removeItem('adminToken'); setToken(''); }}>Logout</Button>
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} indicatorColor="primary" textColor="primary" centered>
                    <Tab label="Page Builder" />
                    <Tab label="Content" />
                    <Tab label="Products" />
                    <Tab label="Media" />
                    <Tab label="Deploy" />
                </Tabs>
            </Paper>

            <Box sx={{ p: 2 }}>
                {activeTab === 0 && <PageBuilder token={token} baseUrl={BASE_URL} showMessage={setMessage} />}
                {activeTab === 1 && <ContentManager token={token} baseUrl={BASE_URL} showMessage={setMessage} />}
                {activeTab === 2 && <ProductManager token={token} baseUrl={BASE_URL} showMessage={setMessage} />}
                {activeTab === 3 && <MediaManager token={token} baseUrl={BASE_URL} showMessage={setMessage} />}
                {activeTab === 4 && <DeployManager token={token} baseUrl={BASE_URL} showMessage={setMessage} />}
            </Box>

            {message.text && <Snackbar open autoHideDuration={6000} onClose={() => setMessage({ type: '', text: '' })}><Alert severity={message.type as any}>{message.text}</Alert></Snackbar>}
        </Container>
    );
}

// --- Sub-Components ---

function ContentManager({ token, baseUrl, showMessage }: any) {
    const [content, setContent] = useState<any>({});

    useEffect(() => {
        fetch(`${baseUrl}/admin/content`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setContent(data));
    }, [baseUrl, token]);

    const handleSave = async () => {
        try {
            const res = await fetch(`${baseUrl}/admin/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(content)
            });
            if (res.ok) showMessage({ type: 'success', text: 'Content updated' });
            else showMessage({ type: 'error', text: 'Update failed' });
        } catch (e) { showMessage({ type: 'error', text: 'Error' }); }
    };

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Home Page Content</Typography>
                    <TextField fullWidth label="Hero Title" margin="normal" value={content['home_hero_title'] || ''} onChange={e => setContent({ ...content, home_hero_title: e.target.value })} />
                    <TextField fullWidth label="Hero Subtitle" margin="normal" multiline rows={2} value={content['home_hero_subtitle'] || ''} onChange={e => setContent({ ...content, home_hero_subtitle: e.target.value })} />
                    <TextField fullWidth label="Hero Image URL" margin="normal" value={content['home_hero_image'] || ''} onChange={e => setContent({ ...content, home_hero_image: e.target.value })} />

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Theme Colors</Typography>
                    <Box display="flex" gap={2} my={2}>
                        <Box>
                            <Typography variant="caption">Primary Color</Typography>
                            <input type="color" value={content['theme_primary'] || '#4a148c'} onChange={e => setContent({ ...content, theme_primary: e.target.value })} style={{ display: 'block', width: 50, height: 50, cursor: 'pointer' }} />
                        </Box>
                        <Box>
                            <Typography variant="caption">Secondary Color</Typography>
                            <input type="color" value={content['theme_secondary'] || '#7b1fa2'} onChange={e => setContent({ ...content, theme_secondary: e.target.value })} style={{ display: 'block', width: 50, height: 50, cursor: 'pointer' }} />
                        </Box>
                    </Box>

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Animation Settings</Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Hero Animation</InputLabel>
                        <Select value={content['home_hero_animation'] || 'fade'} label="Hero Animation" onChange={e => setContent({ ...content, home_hero_animation: e.target.value })}>
                            <MenuItem value="fade">Fade In</MenuItem>
                            <MenuItem value="slide">Slide Up</MenuItem>
                            <MenuItem value="zoom">Zoom In</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>Save Changes</Button>
                </Paper>
            </Grid>
        </Grid>
    );
}

function ProductManager({ token, baseUrl, showMessage }: any) {
    const [products, setProducts] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any>({ name: '', price: 0, description: '', imageUrl: '' });

    const fetchProducts = () => {
        fetch(`${baseUrl}/products`)
            .then(res => res.json())
            .then(data => setProducts(data.products || []));
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleSave = async () => {
        const method = currentProduct.id ? 'PUT' : 'POST';
        const url = currentProduct.id ? `${baseUrl}/products/${currentProduct.id}` : `${baseUrl}/products`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(currentProduct)
            });
            if (res.ok) {
                showMessage({ type: 'success', text: 'Product saved' });
                setOpen(false);
                fetchProducts();
            } else showMessage({ type: 'error', text: 'Save failed' });
        } catch (e) { showMessage({ type: 'error', text: 'Error' }); }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await fetch(`${baseUrl}/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
            fetchProducts();
            showMessage({ type: 'success', text: 'Product deleted' });
        } catch (e) { showMessage({ type: 'error', text: 'Error' }); }
    };

    return (
        <Box>
            <Button variant="contained" onClick={() => { setCurrentProduct({ name: '', price: 0, description: '', imageUrl: '' }); setOpen(true); }} sx={{ mb: 2 }}>Add Product</Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Image</TableCell><TableCell>Name</TableCell><TableCell>Price</TableCell><TableCell>Description</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
                    <TableBody>
                        {products.map(p => (
                            <TableRow key={p.id}>
                                <TableCell>{p.id}</TableCell>
                                <TableCell><img src={p.imageUrl} alt={p.name} style={{ width: 50, height: 50, objectFit: 'cover' }} /></TableCell>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>${p.price}</TableCell>
                                <TableCell sx={{ maxWidth: 200 }}>
                                    <Typography noWrap variant="body2">{p.description}</Typography>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => { setCurrentProduct(p); setOpen(true); }}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(p.id)} color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentProduct.id ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Name" margin="normal" value={currentProduct.name} onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })} />
                    <TextField fullWidth label="Price" type="number" margin="normal" value={currentProduct.price} onChange={e => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })} />
                    <TextField fullWidth label="Description" margin="normal" multiline rows={3} value={currentProduct.description} onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })} />
                    <TextField fullWidth label="Image URL" margin="normal" value={currentProduct.imageUrl} onChange={e => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

function MediaManager({ token, baseUrl, showMessage }: any) {
    const [media, setMedia] = useState<any[]>([]);

    const fetchMedia = () => {
        fetch(`${baseUrl}/admin/media`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setMedia(data));
    };

    useEffect(() => { fetchMedia(); }, []);

    const handleUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${baseUrl}/admin/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            if (res.ok) {
                showMessage({ type: 'success', text: 'File uploaded' });
                fetchMedia();
            } else showMessage({ type: 'error', text: 'Upload failed' });
        } catch (e) { showMessage({ type: 'error', text: 'Error' }); }
    };

    return (
        <Box>
            <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} sx={{ mb: 3 }}>
                Upload Image
                <input type="file" hidden onChange={handleUpload} accept="image/*" />
            </Button>
            <Grid container spacing={2}>
                {media.map((file, i) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
                        <Card>
                            <CardMedia component="img" height="140" image={file.url} alt={file.name} />
                            <CardContent>
                                <Typography variant="caption" noWrap display="block">{file.name}</Typography>
                                <Button size="small" onClick={() => { navigator.clipboard.writeText(file.url); showMessage({ type: 'info', text: 'URL Copied' }); }}>Copy URL</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

function DeployManager({ token, baseUrl, showMessage }: any) {
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState('');

    const handleDeploy = async () => {
        if (!window.confirm('This will commit all changes and push to GitHub, triggering a Vercel deployment. Continue?')) return;
        setLoading(true);
        setOutput('Deploying...');
        try {
            const res = await fetch(`${baseUrl}/admin/deploy`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setOutput(data.output || data.message);
            if (res.ok) showMessage({ type: 'success', text: 'Deployment triggered!' });
            else showMessage({ type: 'error', text: 'Deployment failed' });
        } catch (e) {
            setOutput('Network Error');
            showMessage({ type: 'error', text: 'Error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', py: 4 }}>
            <RocketLaunchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>Deploy to Production</Typography>
            <Typography paragraph color="textSecondary">
                Push your local changes (content, images, products) to the live website.
                This will trigger a new build on Vercel.
            </Typography>
            <Button
                variant="contained"
                size="large"
                onClick={handleDeploy}
                disabled={loading}
                sx={{ mt: 2, px: 4, py: 1.5 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Deploy Now'}
            </Button>
            {output && (
                <Paper sx={{ mt: 4, p: 2, bgcolor: '#1e1e1e', color: '#00ff00', textAlign: 'left', overflowX: 'auto' }}>
                    <pre>{output}</pre>
                </Paper>
            )}
        </Container>
    );
}
