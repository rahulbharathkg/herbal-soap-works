import React from 'react';
import { Box, Typography } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';

interface ProductPlaceholderProps {
    height?: number | string;
    text?: string;
}

export default function ProductPlaceholder({ height = 200, text = 'No Image Available' }: ProductPlaceholderProps) {
    return (
        <Box
            sx={{
                height,
                width: '100%',
                bgcolor: 'grey.100',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'grey.400',
                borderRadius: 1,
                overflow: 'hidden',
            }}
        >
            <SpaIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {text}
            </Typography>
        </Box>
    );
}
