import React, { useState } from 'react';
import { Box, Container, Grid, Typography, TextField, Button, IconButton, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = async () => {
        if (!email) return;
        try {
            const apiBase = process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://herbal-soap-works-backend.fly.dev/api' : 'http://localhost:4000');
            await fetch(`${apiBase}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            setSubscribed(true);
            setEmail('');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Box component="footer" sx={{ bgcolor: '#2c3e50', color: 'white', py: 6, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" gutterBottom fontWeight={700}>Herbal Soap Works</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
                            Handcrafted with love, using only the finest natural ingredients. Experience the purity of nature in every wash.
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" gutterBottom fontWeight={700}>Quick Links</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/" color="inherit" underline="hover">Home</Link>
                            <Link href="/products" color="inherit" underline="hover">Shop All</Link>
                            <Link href="/profile" color="inherit" underline="hover">My Account</Link>
                            <Link href="#" color="inherit" underline="hover">Contact Us</Link>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" gutterBottom fontWeight={700}>Stay Updated</Typography>
                        {subscribed ? (
                            <Typography color="success.light">Thanks for subscribing!</Typography>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    placeholder="Your Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                                />
                                <Button variant="contained" color="secondary" onClick={handleSubscribe}>
                                    Join
                                </Button>
                            </Box>
                        )}
                        <Box sx={{ mt: 3 }}>
                            <IconButton color="inherit"><FacebookIcon /></IconButton>
                            <IconButton color="inherit"><TwitterIcon /></IconButton>
                            <IconButton color="inherit"><InstagramIcon /></IconButton>
                        </Box>
                    </Grid>
                </Grid>
                <Typography variant="body2" align="center" sx={{ mt: 4, opacity: 0.6 }}>
                    © {new Date().getFullYear()} Herbal Soap Works. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
