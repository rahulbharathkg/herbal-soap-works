import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Typography, Button, IconButton, Badge, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SpaIcon from '@mui/icons-material/Spa';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { motion, AnimatePresence } from 'framer-motion';
// import AdminProducts from './pages/AdminProducts';
// import AdminLogs from './pages/AdminLogs';
// import AdminAnalytics from './pages/AdminAnalytics';
// import AdminOrders from './pages/AdminOrders';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';

import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import CartDrawer from './components/CartDrawer';
import { CartProvider, useCart } from './context/CartContext';
import UserDashboard from './pages/UserDashboard';
import CustomSoapBuilder from './pages/CustomSoapBuilder';
import AdminPanel from './pages/AdminPanel';

import { jwtDecode, JwtPayload } from 'jwt-decode';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

interface CustomJwtPayload extends JwtPayload {
  role?: string;
  email?: string;
}

const baseMenu = [
  { text: 'Home', icon: <SpaIcon />, path: '/' },
  { text: 'Products', icon: <SpaIcon />, path: '/products' },
  { text: 'Custom Soap', icon: <SpaIcon />, path: '/custom-soap' },
  // Cart is handled by icon button now
];

const adminMenu = [
  { text: 'Dashboard', icon: <SpaIcon />, path: '/admin' },
  { text: 'Products', icon: <SpaIcon />, path: '/admin/products' },
  { text: 'Orders', icon: <SpaIcon />, path: '/admin/orders' },
  { text: 'Analytics', icon: <SpaIcon />, path: '/admin/analytics' },
  { text: 'Logs', icon: <SpaIcon />, path: '/admin/logs' },
];

function App() {
  // Use production API URL for deployed site, localhost for development
  const rawApiBase = process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://herbal-soap-works-backend.fly.dev' : 'http://localhost:4000');
  const apiBase = rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase}/api`;

  const [theme, setTheme] = React.useState(createTheme({
    palette: {
      primary: { main: '#2E3B29' }, // Earthy Dark Green
      secondary: { main: '#C4A484' }, // Light Brown/Beige
      background: { default: '#ffffff' }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 }
    },
    shape: { borderRadius: 0 } // sharper edges for modern look
  }));

  React.useEffect(() => {
    fetch(`${apiBase}/admin/content`)
      .then(res => res.json())
      .then(data => {
        if (data.theme_primary || data.theme_secondary) {
          setTheme(createTheme({
            palette: {
              primary: { main: data.theme_primary || '#2E3B29' },
              secondary: { main: data.theme_secondary || '#C4A484' },
              background: { default: '#ffffff' }
            },
            typography: {
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              button: { textTransform: 'none' }
            },
            shape: { borderRadius: 0 }
          }));
        }
      })
      .catch(err => console.error('Failed to load theme', err));
  }, [apiBase]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout apiBase={apiBase} />}>
              <Route index element={<HomePage apiBase={apiBase} />} />
              <Route path="products" element={<ProductsPage apiBase={apiBase} />} />
              <Route path="products/:id" element={<ProductDetailPage apiBase={apiBase} />} />
              <Route path="checkout" element={<CheckoutPage apiBase={apiBase} />} />
              <Route path="profile" element={<UserDashboard apiBase={apiBase} />} />
              <Route path="custom-soap" element={<CustomSoapBuilder apiBase={apiBase} />} />
              <Route path="admin" element={<AdminPanel apiBase={apiBase} />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}

function Layout({ apiBase }: { apiBase: string }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const { setIsCartOpen, cartCount } = useCart();

  function decodeToken(token?: string | null): CustomJwtPayload | null {
    if (!token) return null;
    try {
      const payload = jwtDecode<CustomJwtPayload>(token);
      return payload;
    } catch (e) {
      console.error('Error decoding token:', e);
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
  }, []);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
            <MenuIcon fontSize="large" />
          </IconButton>
          <Typography variant="h4" component={Link} to="/" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 2, color: 'primary.main', textDecoration: 'none' }}>
            Herbal Soap Works 🌿
          </Typography>
          {userEmail ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button color="inherit" startIcon={<PersonIcon />} component={Link} to="/profile" sx={{ fontWeight: 600 }}>
                My Account
              </Button>
            </Box>
          ) : (
            <Button color="inherit" sx={{ fontWeight: 600 }} onClick={() => setLoginOpen(true)}>Login</Button>
          )}
          <IconButton color="inherit" onClick={() => setIsCartOpen(true)} sx={{ ml: 1 }}>
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <CartDrawer />
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 2 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <AnimatePresence>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Typography variant="h5" sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }}>
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
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} apiBase={apiBase} onSuccess={() => { refreshAuthFromStorage(); }} />
    </Box>
  );
}



// function AdminLayout({ apiBase }: { apiBase: string }) {
//   const [isAdmin, setIsAdmin] = React.useState(false);

//   function decodeToken(token?: string | null): CustomJwtPayload | null {
//     if (!token) return null;
//     try {
//       const payload = jwtDecode<CustomJwtPayload>(token);
//       return payload;
//     } catch (e) {
//       console.error('Error decoding token:', e);
//       return null;
//     }
//   }

//   React.useEffect(() => {
//     const token = localStorage.getItem('hsw_token');
//     const payload = decodeToken(token);
//     setIsAdmin(!!(payload && payload.role === 'admin'));
//   }, []);

//   if (!isAdmin) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Typography variant="h6">Admin area — please sign in with an admin account.</Typography>
//       </Box>
//     );
//   }

//   return <Outlet />;
// }

export default App;
