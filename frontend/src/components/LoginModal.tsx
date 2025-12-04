import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Link, FormControlLabel, Checkbox } from '@mui/material';

export default function LoginModal({ open, onClose, apiBase, onSuccess }: { open: boolean; onClose: () => void; apiBase: string; onSuccess?: () => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister
      ? { email, password, name, isSubscribed }
      : { email, password };

    try {
      const res = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({ message: 'Authentication failed' }));
        setError(j.message || 'Authentication failed');
        setLoading(false);
        return;
      }

      const j = await res.json();
      localStorage.setItem('hsw_token', j.token);
      localStorage.setItem('hsw_user', email);
      if (remember) localStorage.setItem('hsw_remember', '1');
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
        <Typography>{isRegister ? 'Create Account' : 'Login'}</Typography>
        <Button size="small" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Switch to Login' : 'Create Account'}
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {isRegister && (
            <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          )}
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />

          {isRegister ? (
            <FormControlLabel control={<Checkbox checked={isSubscribed} onChange={(e) => setIsSubscribed(e.target.checked)} />} label="Subscribe to Newsletter" />
          ) : (
            <FormControlLabel control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />} label="Remember me" />
          )}

          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={loading}>
          {loading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
