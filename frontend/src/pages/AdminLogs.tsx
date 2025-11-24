import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';

export default function AdminLogs({ apiBase }: { apiBase: string }) {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${apiBase}/api/admin/logs`).then((r) => r.json()).then(setLogs).catch(console.error);
  }, [apiBase]);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Admin Logs</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 2 }}>
        {logs.map((l) => (
          <Paper key={l.id} sx={{ p: 2 }}>
            <Typography variant="subtitle2">{l.action} — {l.userEmail} — {new Date(l.createdAt).toLocaleString()}</Typography>
            <Typography variant="body2">{l.details}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
