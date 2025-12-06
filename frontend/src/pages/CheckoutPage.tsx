import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, TextField, Radio, RadioGroup, FormControlLabel, FormControl, Button, Paper, Divider, CircularProgress, Alert } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CountrySelector from '../components/CountrySelector';
import UPIPayment from '../components/UPIPayment';
import BankTransfer from '../components/BankTransfer';
import { jwtDecode } from 'jwt-decode';

export default function CheckoutPage({ apiBase }: { apiBase: string }) {
    const { items, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('IN'); // Default to India
    const [address, setAddress] = useState('');

    const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'BankTransfer'>('UPI');
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);
    const [paymentReference, setPaymentReference] = useState('');

    const [priceMultiplier, setPriceMultiplier] = useState(1);
    const [detectedCountry, setDetectedCountry] = useState('');

    // Check for logged-in user
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                if (decoded.name) {
                    const parts = decoded.name.split(' ');
                    setFirstName(parts[0]);
                    setLastName(parts.slice(1).join(' '));
                }
                if (decoded.email) setEmail(decoded.email);
            } catch (e) {
                console.error('Invalid token');
            }
        }
    }, []);

    // Detect Country from IP
    useEffect(() => {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                setDetectedCountry(data.country_code);
                if (data.country_code !== 'IN') {
                    setPriceMultiplier(1.6); // 60% increase
                    setCountry(data.country_code);
                }
            })
            .catch(err => console.error('Error fetching IP location', err));
    }, []);

    const finalTotal = cartTotal * priceMultiplier;

    if (items.length === 0 && !orderPlaced) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5">Your cart is empty.</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/products')}>Browse Products</Button>
            </Container>
        );
    }

    async function handlePlaceOrder() {
        if (!firstName || !lastName || !email || !phone || !address) {
            alert('Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            const orderRes = await fetch(`${apiBase}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(i => ({ productId: i.productId, qty: i.quantity, price: i.price * priceMultiplier })),
                    total: finalTotal,
                    location: `${address}, ${country}`,
                    customerEmail: email,
                    customerName: `${firstName} ${lastName}`,
                    customerPhone: phone
                })
            });
            if (!orderRes.ok) throw new Error('Failed to create order');
            const orderData = await orderRes.json();
            setOrderId(orderData.id);
            setOrderPlaced(true);
            clearCart();
        } catch (e) {
            console.error(e);
            alert('Error placing order. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    async function handleConfirmPayment() {
        if (!orderId) return;
        setLoading(true);
        try {
            const payRes = await fetch(`${apiBase}/api/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    method: paymentMethod,
                    amount: finalTotal,
                    reference: paymentReference || 'N/A'
                })
            });
            if (!payRes.ok) throw new Error('Failed to record payment');

            alert('Payment recorded! We will verify and process your order.');
            navigate('/');
        } catch (e) {
            console.error(e);
            alert('Error recording payment.');
        } finally {
            setLoading(false);
        }
    }

    if (orderPlaced) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper sx={{ p: 4, borderRadius: 4 }}>
                    <Typography variant="h4" gutterBottom color="success.main" fontWeight={700}>Order Placed!</Typography>
                    <Typography paragraph>Order ID: #{orderId}</Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>Complete Payment</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Please complete the payment of <strong>${finalTotal.toFixed(2)}</strong> using the method below.
                    </Typography>

                    {paymentMethod === 'UPI' ? <UPIPayment /> : <BankTransfer />}

                    <TextField
                        fullWidth
                        label="Transaction ID / Reference No."
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        helperText="Enter the reference number from your payment app"
                        sx={{ mb: 3, mt: 3 }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleConfirmPayment}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'I Have Paid'}
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" gutterBottom fontWeight={700}>Checkout</Typography>
            {priceMultiplier > 1 && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    International pricing applied based on your location ({detectedCountry}).
                </Alert>
            )}
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom>Contact & Shipping</Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth label="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <CountrySelector
                                    value={phone}
                                    onChange={setPhone}
                                    onCountryChange={(c) => {
                                        if (c && c !== 'IN') {
                                            setPriceMultiplier(1.6);
                                            setCountry(c);
                                        } else {
                                            setPriceMultiplier(1);
                                            setCountry('IN');
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth label="Full Address" multiline rows={3} value={address} onChange={e => setAddress(e.target.value)} />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom>Payment Method</Typography>
                        <FormControl component="fieldset">
                            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
                                <FormControlLabel value="UPI" control={<Radio />} label="UPI (Google Pay, PhonePe, Paytm)" />
                                <FormControlLabel value="BankTransfer" control={<Radio />} label="Bank Transfer (IMPS/NEFT)" />
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#fafafa' }}>
                        <Typography variant="h6" gutterBottom>Order Summary</Typography>
                        {items.map(item => (
                            <Box key={item.productId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">{item.name} x {item.quantity}</Typography>
                                <Typography variant="body2" fontWeight={600}>${(item.price * item.quantity * priceMultiplier).toFixed(2)}</Typography>
                            </Box>
                        ))}
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6" color="primary.main">${finalTotal.toFixed(2)}</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            sx={{ py: 1.5, fontWeight: 700 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
