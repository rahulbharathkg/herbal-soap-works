import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Link, FormControlLabel, Checkbox } from '@mui/material';

export default function LoginModal({ open, onClose, apiBase, onSuccess }: { open: boolean; onClose: () => void; apiBase: string; onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (!res.ok) {
        const j = await res.json().catch(() => ({ message: 'Login failed' }));
        setError(j.message || 'Login failed');
        setLoading(false);
        return;
      }
      const j = await res.json();
      localStorage.setItem('hsw_token', j.token);
      localStorage.setItem('hsw_user', email);
      if (remember) localStorage.setItem('hsw_remember', '1');
      // if admin login flow, optionally persist SB secret if present in response.edit
      window.dispatchEvent(new Event('hsw_token_changed'));
      onClose();
      onSuccess && onSuccess();
      setLoading(false);
    } catch (e: any) {
      setError(e.message || 'Network error');
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>Login</Typography>
        <Link component="button" variant="caption" onClick={() => setIsAdminLogin(!isAdminLogin)}>{isAdminLogin ? 'Customer login' : 'Admin login'}</Link>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <FormControlLabel control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />} label="Remember me" />
          {isAdminLogin && (
            <Typography variant="caption" sx={{ textAlign: 'right', color: 'text.secondary' }}>Use your admin credentials to access admin tools.</Typography>
          )}
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={loading}>{loading ? 'Signing in...' : 'Login'}</Button>
      </DialogActions>
    </Dialog>
  );
}
