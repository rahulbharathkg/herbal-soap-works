
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
import ProductDetailPage from './pages/ProductDetailPage';

import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import { CircularProgress } from '@mui/material';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

interface CustomJwtPayload extends JwtPayload {
  role?: string;
  email?: string;
}

const baseMenu = [
  { text: 'Home', icon: <SpaIcon />, path: '/' },
  { text: 'Products', icon: <SpaIcon />, path: '/products' },
  { text: 'Cart', icon: <SpaIcon />, path: '/cart' },
];

const adminMenu = [
  { text: 'Dashboard', icon: <SpaIcon />, path: '/admin' },
  { text: 'Products', icon: <SpaIcon />, path: '/admin/products' },
  { text: 'Orders', icon: <SpaIcon />, path: '/admin/orders' },
  { text: 'Analytics', icon: <SpaIcon />, path: 'admin/analytics' },
  { text: 'Logs', icon: <SpaIcon />, path: '/admin/logs' },
];

function App() {
  const [apiConfig, setApiConfig] = React.useState<{ BACKEND_PORT?: number; USE_SQLITE?: boolean } | null>(null);

  React.useEffect(() => {
    fetch('http://localhost:4000/config').then((r) => r.json()).then((c) => setApiConfig(c)).catch(() => setApiConfig(null));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout apiConfig={apiConfig} />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage apiBase={`http://localhost:${apiConfig?.BACKEND_PORT || 4000}`} />} />
          <Route path="products/:id" element={<ProductDetailPage apiBase={`http://localhost:${apiConfig?.BACKEND_PORT || 4000}`} />} />
          <Route path="admin" element={<AdminLayout apiConfig={apiConfig} />}>
            <Route path="products" element={<AdminProducts apiBase={`http://localhost:${apiConfig?.BACKEND_PORT || 4000}`} />} />
            <Route path="logs" element={<AdminLogs apiBase={`http://localhost:${apiConfig?.BACKEND_PORT || 4000}`} />} />
            <Route path="analytics" element={<AdminAnalytics apiBase={`http://localhost:${apiConfig?.BACKEND_PORT || 4000}`} />} />
            <Route path="orders" element={<AdminOrders apiBase={`http://localhost:${apiConfig?.BACKEND_PORT || 4000}`} />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout({ apiConfig }: { apiConfig: any }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  function decodeToken(token?: string | null): CustomJwtPayload | null {
    if (!token) return null;
    try {
      // For frontend, we only decode the token. Verification should happen on the backend.
      const payload = jwtDecode<CustomJwtPayload>(token);
      return payload;
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }
  }

  function refreshAuthFromStorage() {
    const token = localStorage.getItem('hsw_token');
    const payload = decodeToken(token);
    setIsAdmin(!!(payload && payload.role === 'admin'));
    setUserEmail(payload?.email || null);
  }

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
                    <ListItemButton component={Link} to={item.path} onClick={() => setDrawerOpen(false)}>
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
      <Outlet />
      <Footer />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} apiBase={`http://localhost:${apiConfig?.BACKEND_PORT || 4000}`} onSuccess={() => { refreshAuthFromStorage(); }} />
    </Box>
  );
}



function AdminLayout({ apiConfig }: { apiConfig: any }) {
  const [isAdmin, setIsAdmin] = React.useState(false);

  function decodeToken(token?: string | null): CustomJwtPayload | null {
    if (!token) return null;
    try {
      // For frontend, we only decode the token. Verification should happen on the backend.
      const payload = jwtDecode<CustomJwtPayload>(token);
      return payload;
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }
  }

  React.useEffect(() => {
    const token = localStorage.getItem('hsw_token');
    const payload = decodeToken(token);
    setIsAdmin(!!(payload && payload.role === 'admin'));
  }, []);

  if (apiConfig === null) {
    return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  if (!isAdmin) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Admin area — please sign in with an admin account.</Typography>
      </Box>
    );
  }

  return <Outlet />;
}

export default App;
