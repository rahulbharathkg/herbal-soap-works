import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';

export default function AdminOrders({ apiBase }: { apiBase: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${apiBase}/api/orders`).then((r) => r.json()).then(setOrders).catch(console.error);
  }, [apiBase]);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Orders</Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow><TableCell>ID</TableCell><TableCell>Items</TableCell><TableCell>Total</TableCell><TableCell>Location</TableCell><TableCell>Created</TableCell></TableRow>
          </TableHead>
          <TableBody>
            {orders.map(o => (
              <TableRow key={o.id}><TableCell>{o.id}</TableCell><TableCell>{o.items}</TableCell><TableCell>${o.total}</TableCell><TableCell>{o.location}</TableCell><TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
