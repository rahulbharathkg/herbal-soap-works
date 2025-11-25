import React from 'react';
import { Box, Container, Typography, Card, CardContent, Avatar, Grid, Rating } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const reviews = [
    {
        id: 1,
        name: 'Sarah Johnson',
        text: 'The Lavender Bliss soap is absolutely amazing! It smells divine and leaves my skin feeling so soft. Highly recommend!',
        rating: 5,
        initial: 'S'
    },
    {
        id: 2,
        name: 'Michael Chen',
        text: 'I love the Mint Fresh soap. It is perfect for my morning shower, really wakes me up. Great quality and long-lasting.',
        rating: 5,
        initial: 'M'
    },
    {
        id: 3,
        name: 'Emily Davis',
        text: 'Beautiful packaging and even better product. The Rose Glow soap has cleared up my skin. Will definitely buy again.',
        rating: 4,
        initial: 'E'
    }
];

export default function Testimonials() {
    return (
        <Box sx={{ py: 10, bgcolor: '#f9f9f9' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                        WHAT PEOPLE SAY
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: '#1a1a1a' }}>
                        Customer Love
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {reviews.map((review) => (
                        <Grid size={{ xs: 12, md: 4 }} key={review.id}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    borderRadius: 4,
                                    bgcolor: 'white',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                                    position: 'relative',
                                    overflow: 'visible',
                                    mt: 2
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -20,
                                        left: 32,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        borderRadius: '50%',
                                        p: 1
                                    }}
                                >
                                    <FormatQuoteIcon fontSize="large" />
                                </Box>
                                <CardContent sx={{ pt: 6, px: 4, pb: 4 }}>
                                    <Rating value={review.rating} readOnly size="small" sx={{ mb: 2 }} />
                                    <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', color: 'text.secondary', lineHeight: 1.6 }}>
                                        "{review.text}"
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 700 }}>{review.initial}</Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{review.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">Verified Buyer</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
