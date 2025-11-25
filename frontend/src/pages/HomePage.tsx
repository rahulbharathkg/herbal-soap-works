import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Testimonials from '../components/Testimonials';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function HomePage() {
    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    minHeight: '90vh',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'
                }}
            >
                {/* Abstract Background Shapes */}
                <Box sx={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.4)', filter: 'blur(80px)' }} />
                <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(123, 31, 162, 0.1)', filter: 'blur(60px)' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 3, mb: 2, display: 'block' }}>
                                    100% NATURAL & ORGANIC
                                </Typography>
                                <Typography variant="h1" sx={{ fontWeight: 900, color: '#2e1a47', mb: 3, fontSize: { xs: '3rem', md: '4.5rem' }, lineHeight: 1.1 }}>
                                    Pure Nature <br />
                                    <span style={{ color: '#7b1fa2' }}>For Your Skin</span>
                                </Typography>
                                <Typography variant="h5" sx={{ color: 'text.secondary', mb: 5, maxWidth: 500, lineHeight: 1.6 }}>
                                    Experience the luxury of handmade herbal soaps. Crafted with care to nourish, rejuvenate, and protect your skin.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        component={Link}
                                        to="/products"
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            py: 2,
                                            px: 4,
                                            borderRadius: 50,
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            boxShadow: '0 10px 30px rgba(123, 31, 162, 0.3)'
                                        }}
                                    >
                                        Shop Collection
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        sx={{ py: 2, px: 4, borderRadius: 50, fontSize: '1.1rem', fontWeight: 700, borderWidth: 2 }}
                                    >
                                        Learn More
                                    </Button>
                                </Box>
                            </motion.div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 20,
                                            left: 20,
                                            right: -20,
                                            bottom: -20,
                                            border: '2px solid rgba(123, 31, 162, 0.3)',
                                            borderRadius: 8,
                                            zIndex: -1
                                        }
                                    }}
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1600857062241-98e5b4f90ba1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Herbal Soap"
                                        style={{ width: '100%', borderRadius: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
                                    />
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Testimonials Section */}
            <Testimonials />
        </Box>
    );
}
