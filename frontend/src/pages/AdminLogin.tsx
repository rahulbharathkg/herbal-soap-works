import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

export default function AdminLogin({ apiBase }: { apiBase: string }) {
  const [email, setEmail] = useState('admin@herbalsoapworks.local');
  const [password, setPassword] = useState('adminpass');
  const [error, setError] = useState<string | null>(null);

  async function login() {
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const j = await res.json();
        setError(j.message || 'Login failed');
        return;
      }
      const j = await res.json();
      localStorage.setItem('hsw_token', j.token);
      // also store simple user email
      localStorage.setItem('hsw_user', email);
      window.dispatchEvent(new Event('hsw_token_changed'));
    } catch (e: any) {
      setError(e.message || 'Network error');
    }
  }

  function logout() {
    localStorage.removeItem('hsw_token');
    localStorage.removeItem('hsw_user');
    window.dispatchEvent(new Event('hsw_token_changed'));
  }

  const token = localStorage.getItem('hsw_token');

  return (
    <Box sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">Admin Login</Typography>
      {token ? (
        <Box>
          <Typography variant="body2">Logged in as {localStorage.getItem('hsw_user')}</Typography>
          <Button variant="outlined" onClick={logout} sx={{ mt: 1 }}>Logout</Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button variant="contained" onClick={login}>Login</Button>
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}
