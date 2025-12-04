import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Testimonials from '../components/Testimonials';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

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
                {/* Animated Background Elements */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', filter: 'blur(80px)' }}
                />
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', bottom: -50, left: -50, width: 400, height: 400, borderRadius: '50%', background: 'rgba(123, 31, 162, 0.1)', filter: 'blur(60px)' }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 3, mb: 2, display: 'block' }}>
                                    NEW FEATURE
                                </Typography>
                                <Typography variant="h1" sx={{ fontWeight: 900, color: '#2e1a47', mb: 3, fontSize: { xs: '3rem', md: '4.5rem' }, lineHeight: 1.1 }}>
                                    Design Your <br />
                                    <span style={{ color: '#7b1fa2' }}>Perfect Soap</span>
                                </Typography>
                                <Typography variant="h5" sx={{ color: 'text.secondary', mb: 5, maxWidth: 500, lineHeight: 1.6 }}>
                                    Craft a soap that's uniquely yours. Choose your base, ingredients, oils, and fragrance to match your skin's needs.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button
                                        component={Link}
                                        to="/custom-soap"
                                        variant="contained"
                                        size="large"
                                        startIcon={<AutoFixHighIcon />}
                                        sx={{
                                            py: 2,
                                            px: 4,
                                            borderRadius: 50,
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            boxShadow: '0 10px 30px rgba(123, 31, 162, 0.4)',
                                            background: 'linear-gradient(45deg, #7b1fa2 30%, #ab47bc 90%)'
                                        }}
                                    >
                                        Start Customizing
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/products"
                                        variant="outlined"
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ py: 2, px: 4, borderRadius: 50, fontSize: '1.1rem', fontWeight: 700, borderWidth: 2 }}
                                    >
                                        Shop Collection
                                    </Button>
                                </Box>
                            </motion.div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    {/* Floating Elements Animation */}
                                    <motion.div
                                        animate={{ y: [0, -20, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        style={{ position: 'absolute', top: -40, right: 40, zIndex: 2 }}
                                    >
                                        <Paper elevation={4} sx={{ p: 2, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#e1bee7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌿</Box>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">100% Organic</Typography>
                                                <Typography variant="caption">Certified Ingredients</Typography>
                                            </Box>
                                        </Paper>
                                    </motion.div>

                                    <motion.div
                                        animate={{ y: [0, 20, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        style={{ position: 'absolute', bottom: 40, left: -40, zIndex: 2 }}
                                    >
                                        <Paper elevation={4} sx={{ p: 2, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#ffccbc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✨</Box>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">Custom Made</Typography>
                                                <Typography variant="caption">Just for you</Typography>
                                            </Box>
                                        </Paper>
                                    </motion.div>

                                    <Box
                                        sx={{
                                            position: 'relative',
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                            boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
                                            transform: 'rotate(3deg)'
                                        }}
                                    >
                                        <img
                                            src="https://images.unsplash.com/photo-1600857062241-98e5b4f90ba1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                            alt="Custom Soap Builder"
                                            style={{ width: '100%', display: 'block' }}
                                        />
                                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', p: 4 }}>
                                            <Typography variant="h6" color="white">Lavender & Goat Milk</Typography>
                                            <Typography variant="body2" color="rgba(255,255,255,0.8)">Custom Blend #842</Typography>
                                        </Box>
                                    </Box>
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
