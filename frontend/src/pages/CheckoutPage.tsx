import React, { useState } from 'react';
import { Box, Container, Typography, Grid, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Paper, Divider, Alert, CircularProgress } from '@mui/material';
import { useCart } from '../context/CartContext';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage({ apiBase }: { apiBase: string }) {
    const { items, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'BankTransfer'>('UPI');
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);
    const [paymentReference, setPaymentReference] = useState('');

    if (items.length === 0 && !orderPlaced) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5">Your cart is empty.</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/products')}>Browse Products</Button>
            </Container>
        );
    }

    async function handlePlaceOrder() {
        if (!email || !address) {
            alert('Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            // 1. Create Order
            const orderRes = await fetch(`${apiBase}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(i => ({ productId: i.productId, qty: i.quantity, price: i.price })),
                    total: cartTotal,
                    location: address,
                    customerEmail: email
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
            // 2. Create Payment Record
            const payRes = await fetch(`${apiBase}/api/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    method: paymentMethod,
                    amount: cartTotal,
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
                        Please complete the payment of <strong>${cartTotal.toFixed(2)}</strong> using the method below.
                    </Typography>

                    {paymentMethod === 'UPI' ? (
                        <Box sx={{ textAlign: 'center', my: 4 }}>
                            <Typography variant="subtitle1" gutterBottom>Scan QR to Pay</Typography>
                            <Box sx={{ p: 2, bgcolor: 'white', display: 'inline-block', border: '1px solid #eee', borderRadius: 2 }}>
                                <QRCodeCanvas value={`upi://pay?pa=rahul@upi&pn=HerbalSoapWorks&am=${cartTotal}&tr=${orderId}&tn=Order #${orderId}`} size={200} />
                            </Box>
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                UPI ID: rahul@upi
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ my: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            <Typography variant="subtitle2">Bank Transfer Details:</Typography>
                            <Typography variant="body2">Bank: HDFC Bank</Typography>
                            <Typography variant="body2">Account: 1234567890</Typography>
                            <Typography variant="body2">IFSC: HDFC0001234</Typography>
                            <Typography variant="body2">Name: Herbal Soap Works</Typography>
                        </Box>
                    )}

                    <TextField
                        fullWidth
                        label="Transaction ID / Reference No."
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        helperText="Enter the reference number from your payment app"
                        sx={{ mb: 3 }}
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
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom>Shipping Details</Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth label="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
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
                                <Typography variant="body2" fontWeight={600}>${(item.price * item.quantity).toFixed(2)}</Typography>
                            </Box>
                        ))}
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6" color="primary.main">${cartTotal.toFixed(2)}</Typography>
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
