import React from 'react';
import { Box, Container, Typography, IconButton, Grid, Link, Divider } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export default function Footer() {
    return (
        <Box sx={{ bgcolor: '#2e1a47', color: 'white', py: 6, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, letterSpacing: 1 }}>
                            HERBAL SOAP WORKS
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                            Handcrafted with nature's finest ingredients.
                            We believe in the power of herbs to nourish and rejuvenate your skin.
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Contact Us
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="mailto:contact@herbalsoapworks.com" color="inherit" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', '&:hover': { color: '#e0c3fc' } }}>
                                <EmailIcon fontSize="small" /> contact@herbalsoapworks.com
                            </Link>
                            <Link href="tel:+1234567890" color="inherit" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', '&:hover': { color: '#e0c3fc' } }}>
                                <PhoneIcon fontSize="small" /> +1 (234) 567-890
                            </Link>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Follow Us
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <IconButton
                                component="a"
                                href="https://instagram.com/herbal_soapwork"
                                target="_blank"
                                sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#E1306C' } }}
                            >
                                <InstagramIcon />
                            </IconButton>
                            <IconButton
                                component="a"
                                href="https://wa.me/1234567890"
                                target="_blank"
                                sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#25D366' } }}
                            >
                                <WhatsAppIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'rgba(255,255,255,0.5)' }}>
                            @herbal_soapwork
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

                <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    © {new Date().getFullYear()} Herbal Soap Works. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
