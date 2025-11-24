
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemIcon, ListItemText, Box, Button, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SpaIcon from '@mui/icons-material/Spa';
import { motion, AnimatePresence } from 'framer-motion';
import AdminProducts from './pages/AdminProducts';
import AdminLogs from './pages/AdminLogs';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminOrders from './pages/AdminOrders';
import ProductsPage from './pages/ProductsPage';
import LoginModal from './components/LoginModal';
import { CircularProgress } from '@mui/material';

const baseMenu = [
  { text: 'Home', icon: <SpaIcon /> },
  { text: 'Products', icon: <SpaIcon /> },
  { text: 'Cart', icon: <SpaIcon /> },
];

const adminMenu = [
  { text: 'Admin Dashboard', icon: <SpaIcon /> },
  { text: 'Products', icon: <SpaIcon /> },
  { text: 'Orders', icon: <SpaIcon /> },
  { text: 'Analytics', icon: <SpaIcon /> },
  { text: 'Logs', icon: <SpaIcon /> },
];

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [page, setPage] = React.useState<'home' | 'admin'>('home');
  const [apiConfig, setApiConfig] = React.useState<{ BACKEND_PORT?: number; USE_SQLITE?: boolean } | null>(null);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('http://localhost:4000/config').then((r) => r.json()).then((c) => setApiConfig(c)).catch(() => setApiConfig(null));
  }, []);

  function decodeToken(token?: string | null) {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload;
    } catch (e) { return null; }
  }

  const refreshAuthFromStorage = React.useCallback(() => {
    const token = localStorage.getItem('hsw_token');
    const payload = decodeToken(token);
    setIsAdmin(!!(payload && payload.role === 'admin'));
    setUserEmail(payload?.email || null);
  }, []);

  React.useEffect(() => {
    refreshAuthFromStorage();
    const h = () => refreshAuthFromStorage();
    window.addEventListener('hsw_token_changed', h);
    return () => window.removeEventListener('hsw_token_changed', h);
  }, [refreshAuthFromStorage]);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
            <MenuIcon fontSize="large" />
          </IconButton>
          <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 2, color: '#4a148c' }}>
            Herbal Soap Works
          </Typography>
          {userEmail ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">{userEmail}</Typography>
              <Button color="inherit" sx={{ fontWeight: 600 }} onClick={() => { localStorage.removeItem('hsw_token'); localStorage.removeItem('hsw_user'); window.dispatchEvent(new Event('hsw_token_changed')); }}>Logout</Button>
            </Box>
          ) : (
            <Button color="inherit" sx={{ fontWeight: 600 }} onClick={() => setLoginOpen(true)}>Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 2 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <AnimatePresence>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Typography variant="h5" sx={{ mb: 2, color: '#43a047', fontWeight: 700 }}>
                Menu
              </Typography>
              <List>
                {(isAdmin ? adminMenu : baseMenu).map((item) => (
                  <motion.div
                    key={item.text}
                    whileHover={{ scale: 1.08, x: 10 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <ListItemButton onClick={() => { setPage(item.text.toLowerCase().includes('admin') ? 'admin' : 'home'); setDrawerOpen(false); }}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </motion.div>
                ))}
              </List>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Drawer>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h2" sx={{ color: '#4a148c', fontWeight: 900, mb: 2, textShadow: '0 4px 24px #fff' }}>
            Welcome to Herbal Soap Works
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <Typography variant="h5" sx={{ color: '#43a047', mb: 4 }}>
            Discover natural, handmade soaps with beautiful effects and animations.
          </Typography>
        </motion.div>
      </Box>
      <Box sx={{ mt: 4 }}>
        {page === 'admin' ? (
          apiConfig === null ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
          ) : (
            <>
              {isAdmin ? (
                <Box>
                  <AdminProducts apiBase={`http://localhost:${apiConfig.BACKEND_PORT || 4000}`} />
                  <AdminLogs apiBase={`http://localhost:${apiConfig.BACKEND_PORT || 4000}`} />
                  <AdminAnalytics apiBase={`http://localhost:${apiConfig.BACKEND_PORT || 4000}`} />
                  <AdminOrders apiBase={`http://localhost:${apiConfig.BACKEND_PORT || 4000}`} />
                </Box>
              ) : (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6">Admin area — please sign in with an admin account.</Typography>
                </Box>
              )}
            </>
          )
        ) : (
          <ProductsPage apiBase={`http://localhost:${apiConfig?.BACKEND_PORT || 4000}`} />
        )}
      </Box>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} apiBase={`http://localhost:${apiConfig?.BACKEND_PORT || 4000}`} onSuccess={() => { setPage('admin'); refreshAuthFromStorage(); }} />
    </Box>
  );
}

export default App;
