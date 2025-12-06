import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

export default function BankTransfer() {
    return (
        <Paper sx={{ p: 3, mt: 2, bgcolor: '#e3f2fd' }}>
            <Typography variant="h6" gutterBottom>Bank Transfer Details</Typography>
            <Typography variant="body2" paragraph>
                Please transfer the total amount to the following bank account. Your order will be processed once the payment is received.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1"><strong>Bank Name:</strong> HDFC Bank</Typography>
                <Typography variant="body1"><strong>Account Name:</strong> Herbal Soap Works</Typography>
                <Typography variant="body1"><strong>Account Number:</strong> 50100123456789</Typography>
                <Typography variant="body1"><strong>IFSC Code:</strong> HDFC0001234</Typography>
                <Typography variant="body1"><strong>Branch:</strong> Indiranagar, Bangalore</Typography>
            </Box>
        </Paper>
    );
}
