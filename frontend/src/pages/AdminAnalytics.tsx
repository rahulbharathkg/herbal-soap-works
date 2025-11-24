import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAnalytics({ apiBase }: { apiBase: string }) {
  const [overview, setOverview] = useState<any>(null);
  const [byProduct, setByProduct] = useState<any[]>([]);
  const [byLocation, setByLocation] = useState<any[]>([]);
  const [profitByLocation, setProfitByLocation] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${apiBase}/api/reports/overview`).then((r) => r.json()).then(setOverview).catch(console.error);
    fetch(`${apiBase}/api/reports/by-product`).then((r) => r.json()).then(setByProduct).catch(console.error);
    fetch(`${apiBase}/api/reports/revenue-by-location`).then((r) => r.json()).then(setByLocation).catch(console.error);
    fetch(`${apiBase}/api/reports/profit-by-location`).then((r) => r.json()).then(setProfitByLocation).catch(console.error);
  }, [apiBase]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Analytics Overview</Typography>
      {overview && (
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <Paper sx={{ p: 2 }}><Typography>Views: {overview.totalViews}</Typography></Paper>
          <Paper sx={{ p: 2 }}><Typography>Clicks: {overview.totalClicks}</Typography></Paper>
          <Paper sx={{ p: 2 }}><Typography>Orders: {overview.totalOrders}</Typography></Paper>
          <Paper sx={{ p: 2 }}><Typography>Revenue: ${overview.revenue}</Typography></Paper>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Clicks by Product</Typography>
        <Table>
          <TableHead>
            <TableRow><TableCell>Product ID</TableCell><TableCell>Clicks</TableCell></TableRow>
          </TableHead>
          <TableBody>
            {byProduct.map((r) => (
              <TableRow key={r.productId}><TableCell>{r.productId}</TableCell><TableCell>{r.clicks}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Clicks by Product (Chart)</Typography>
        <Paper sx={{ p: 2, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byProduct.map((r) => ({ productId: String(r.productId), clicks: Number(r.clicks) }))}>
              <XAxis dataKey="productId" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Revenue by Location</Typography>
        <Table>
          <TableHead>
            <TableRow><TableCell>Location</TableCell><TableCell>Orders</TableCell><TableCell>Revenue</TableCell></TableRow>
          </TableHead>
          <TableBody>
            {byLocation.map((r) => (
              <TableRow key={r.location}><TableCell>{r.location || 'Unknown'}</TableCell><TableCell>{r.orders}</TableCell><TableCell>${r.revenue}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Profit by Location</Typography>
        <Table>
          <TableHead>
            <TableRow><TableCell>Location</TableCell><TableCell>Orders</TableCell><TableCell>Revenue</TableCell><TableCell>Cost</TableCell><TableCell>Profit</TableCell></TableRow>
          </TableHead>
          <TableBody>
            {profitByLocation.map((r) => (
              <TableRow key={r.location}><TableCell>{r.location || 'Unknown'}</TableCell><TableCell>{r.orders}</TableCell><TableCell>${r.revenue.toFixed ? r.revenue.toFixed(2) : r.revenue}</TableCell><TableCell>${r.cost.toFixed ? r.cost.toFixed(2) : r.cost}</TableCell><TableCell>${r.profit.toFixed ? r.profit.toFixed(2) : r.profit}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Profit by Location (Chart)</Typography>
        <Paper sx={{ p: 2, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitByLocation.map((r) => ({ location: r.location || 'Unknown', revenue: Number(r.revenue || 0), cost: Number(r.cost || 0), profit: Number(r.profit || 0) }))}>
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#4caf50" />
              <Bar dataKey="cost" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
}
