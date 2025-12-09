
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, Button, TextField, Switch, FormControlLabel, Chip, CircularProgress } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';


interface User {
    id: number;
    name: string;
    email: string;
    isSubscribed: boolean;
}

interface Order {
    id: number;
    total: number;
    status: string;
    createdAt: string;
    items: string; // JSON string
}

export default function UserDashboard({ apiBase }: { apiBase: string }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'settings'>('overview');
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', zip: '' });
    const [showAddressForm, setShowAddressForm] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('hsw_token');
        if (!token) {
            navigate('/');
            return;
        }

        // Fetch user profile and orders
        Promise.all([
            fetch(`${apiBase}/user/profile`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
            fetch(`${apiBase}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
        ]).then(([userData, ordersData]) => {
            if (userData) {
                setUser(userData);
                setName(userData.name || '');
                setIsSubscribed(userData.isSubscribed || false);
                setAddresses(userData.addresses || []);
            }
            if (Array.isArray(ordersData)) {
                setOrders(ordersData);
            }
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, [apiBase, navigate]);

    const handleUpdateProfile = async () => {
        const token = localStorage.getItem('hsw_token');
        try {
            const res = await fetch(`${apiBase}/user/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, isSubscribed })
            });
            await res.json();
            alert('Profile updated successfully!');
        } catch (e) {
            console.error(e);
            alert('Failed to update profile');
        }
    };

    const handleAddAddress = async () => {
        const token = localStorage.getItem('hsw_token');
        try {
            // Basic validation
            if (!newAddress.street || !newAddress.city) return alert('Please fill in street and city');

            const res = await fetch(`${apiBase}/user/address`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    id: Date.now().toString(),
                    ...newAddress,
                    isDefault: addresses.length === 0
                })
            });
            const updatedAddresses = await res.json();
            setAddresses(updatedAddresses);
            setShowAddressForm(false);
            setNewAddress({ label: '', street: '', city: '', zip: '' });
        } catch (e) {
            console.error(e);
            alert('Failed to save address');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('hsw_token');
        localStorage.removeItem('hsw_user');
        window.dispatchEvent(new Event('hsw_token_changed'));
        navigate('/');
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Grid container spacing={4}>
                {/* Sidebar */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ p: 3, bgcolor: '#f8f9fa', textAlign: 'center' }}>
                            <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: '#e1bee7', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                                <Typography variant="h4" color="primary.main">{user?.name?.[0] || user?.email?.[0]?.toUpperCase()}</Typography>
                            </Box>
                            <Typography variant="h6" fontWeight={700}>{user?.name || 'User'}</Typography>
                            <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                        </Box>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton selected={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
                                    <ListItemIcon><PersonIcon color={activeTab === 'overview' ? 'primary' : 'inherit'} /></ListItemIcon>
                                    <ListItemText primary="Overview" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton selected={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
                                    <ListItemIcon><ShoppingBagIcon color={activeTab === 'orders' ? 'primary' : 'inherit'} /></ListItemIcon>
                                    <ListItemText primary="My Orders" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton selected={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')}>
                                    <ListItemIcon><SettingsIcon color={activeTab === 'addresses' ? 'primary' : 'inherit'} /></ListItemIcon>
                                    <ListItemText primary="Addresses" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton selected={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
                                    <ListItemIcon><SettingsIcon color={activeTab === 'settings' ? 'primary' : 'inherit'} /></ListItemIcon>
                                    <ListItemText primary="Settings" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleLogout}>
                                    <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                                    <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error' }} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                {/* Content */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {activeTab === 'overview' && (
                        <Box>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Welcome back, {user?.name || 'Friend'}!</Typography>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#e3f2fd' }}>
                                        <Typography variant="h3" color="primary.main" fontWeight={700}>{orders.length}</Typography>
                                        <Typography variant="subtitle1">Total Orders</Typography>
                                    </Paper>
                                </Grid>
                                {/* Add more stats here */}
                            </Grid>

                            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                            {orders.slice(0, 3).map(order => (
                                <Paper key={order.id} sx={{ p: 2, mb: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>Order #{order.id}</Typography>
                                        <Typography variant="body2" color="text.secondary">{new Date(order.createdAt).toLocaleDateString()}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="h6" color="primary.main">${Number(order.total).toFixed(2)}</Typography>
                                        <Chip label={order.status} size="small" color={order.status === 'Completed' ? 'success' : 'warning'} />
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    )}

                    {activeTab === 'orders' && (
                        <Box>
                            <Typography variant="h5" fontWeight={700} gutterBottom>My Orders</Typography>
                            {orders.length === 0 ? (
                                <Typography color="text.secondary">No orders found.</Typography>
                            ) : (
                                orders.map(order => (
                                    <Paper key={order.id} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6">Order #{order.id}</Typography>
                                                <Typography variant="body2" color="text.secondary">Placed on {new Date(order.createdAt).toLocaleDateString()}</Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="h5" color="primary.main" fontWeight={700}>${Number(order.total).toFixed(2)}</Typography>
                                                <Chip label={order.status} color={order.status === 'Completed' ? 'success' : 'warning'} sx={{ mt: 1 }} />
                                            </Box>
                                        </Box>
                                        <Divider sx={{ my: 2 }} />
                                        <Box>
                                            {JSON.parse(order.items).map((item: any, idx: number) => (
                                                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                                                    <Typography>{item.name || 'Product'} x {item.qty || item.quantity}</Typography>
                                                    <Typography fontWeight={600}>${(item.price * (item.qty || item.quantity)).toFixed(2)}</Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Paper>
                                ))
                            )}
                        </Box>
                    )}

                    {activeTab === 'addresses' && (
                        <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                                <Typography variant="h5" fontWeight={700}>My Addresses</Typography>
                                <Button variant="contained" onClick={() => setShowAddressForm(!showAddressForm)}>
                                    {showAddressForm ? 'Cancel' : 'Add New Address'}
                                </Button>
                            </Box>

                            {showAddressForm && (
                                <Paper sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa' }}>
                                    <Typography variant="h6" gutterBottom>Add Address</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField fullWidth label="Label (e.g. Home, Office)" value={newAddress.label} onChange={e => setNewAddress({ ...newAddress, label: e.target.value })} />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField fullWidth label="Street Address" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} />
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <TextField fullWidth label="City" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <TextField fullWidth label="Zip Code" value={newAddress.zip} onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })} />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Button variant="contained" onClick={handleAddAddress}>Save Address</Button>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            )}

                            {addresses.length === 0 && !showAddressForm ? (
                                <Typography color="text.secondary">No addresses saved yet.</Typography>
                            ) : (
                                <Grid container spacing={3}>
                                    {addresses.map((addr: any, idx: number) => (
                                        <Grid size={{ xs: 12, md: 6 }} key={idx}>
                                            <Paper sx={{ p: 3, border: addr.isDefault ? '2px solid #2E3B29' : '1px solid #ddd', position: 'relative' }}>
                                                {addr.isDefault && <Chip label="Default" size="small" color="primary" sx={{ position: 'absolute', top: 10, right: 10 }} />}
                                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{addr.label || 'Address'}</Typography>
                                                <Typography variant="body2">{addr.street}</Typography>
                                                <Typography variant="body2">{addr.city}, {addr.zip}</Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    )}

                    {activeTab === 'settings' && (
                        <Box>
                            <Typography variant="h5" fontWeight={700} gutterBottom>Account Settings</Typography>
                            <Paper sx={{ p: 4, borderRadius: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField fullWidth label="Full Name" value={name} onChange={e => setName(e.target.value)} />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField fullWidth label="Email Address" value={user?.email} disabled helperText="Email cannot be changed" />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <FormControlLabel
                                            control={<Switch checked={isSubscribed} onChange={e => setIsSubscribed(e.target.checked)} />}
                                            label="Subscribe to Newsletter (Deals, New Products)"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }} sx={{ display: 'flex', gap: 2 }}>
                                        <Button variant="contained" size="large" onClick={handleUpdateProfile}>Save Changes</Button>
                                        <Button variant="outlined" size="large" onClick={() => window.location.reload()}>Refresh Account Status</Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}
