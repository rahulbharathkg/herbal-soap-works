import React from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Box, Typography } from '@mui/material';

interface CountrySelectorProps {
    value: string;
    onChange: (value: string) => void;
    onCountryChange?: (country: string | undefined) => void;
}

export default function CountrySelector({ value, onChange, onCountryChange }: CountrySelectorProps) {
    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="caption" color="textSecondary" gutterBottom>
                Phone Number (Auto-detects country)
            </Typography>
            <PhoneInput
                placeholder="Enter phone number"
                value={value}
                onChange={(val: string | undefined) => {
                    onChange(val || '');
                }}
                onCountryChange={(c: any) => {
                    if (onCountryChange) onCountryChange(c);
                }}
                defaultCountry="IN"
                style={{
                    padding: '10px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '100%'
                }}
            />
        </Box>
    );
}
