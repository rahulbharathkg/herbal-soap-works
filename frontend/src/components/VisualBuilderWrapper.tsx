import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import VisualBuilder from './VisualBuilder';

export default function VisualBuilderWrapper({ token, baseUrl, showMessage }: any) {
    const [blocks, setBlocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${baseUrl}/admin/content`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                if (data.home_layout) {
                    try {
                        setBlocks(JSON.parse(data.home_layout));
                    } catch (e) {
                        console.error("Failed to parse layout", e);
                        setBlocks([]);
                    }
                }
                setLoading(false);
            });
    }, [baseUrl, token]);

    const handleSave = async (newBlocks: any[]) => {
        try {
            // First get existing content to preserve other fields
            const existingRes = await fetch(`${baseUrl}/admin/content`, { headers: { Authorization: `Bearer ${token}` } });
            const existingData = await existingRes.json();

            const res = await fetch(`${baseUrl}/admin/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    ...existingData,
                    home_layout: JSON.stringify(newBlocks)
                })
            });
            if (res.ok) showMessage({ type: 'success', text: 'Layout saved successfully!' });
            else showMessage({ type: 'error', text: 'Save failed' });
        } catch (e) { showMessage({ type: 'error', text: 'Error saving layout' }); }
    };

    if (loading) return <CircularProgress />;

    return <VisualBuilder initialBlocks={blocks} onSave={handleSave} />;
}
