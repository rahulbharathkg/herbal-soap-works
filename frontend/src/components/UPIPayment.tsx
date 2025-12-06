import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function UPIPayment() {
    return (
        <Paper sx={{ p: 3, mt: 2, textAlign: 'center', bgcolor: '#f3e5f5' }}>
            <Typography variant="h6" gutterBottom>Pay via UPI</Typography>
            <Typography variant="body2" paragraph>
                Scan the QR code below with any UPI app (GPay, PhonePe, Paytm)
            </Typography>
            <Box
                component="img"
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=herbalsoap@upi&pn=HerbalSoapWorks&mc=0000&tid=1234567890&tr=1234567890&tn=Payment%20for%20Order&am=0&cu=INR"
                alt="UPI QR Code"
                sx={{ width: 200, height: 200, mb: 2 }}
            />
            <Typography variant="caption" display="block">
                UPI ID: herbalsoap@upi
            </Typography>
        </Paper>
    );
}
