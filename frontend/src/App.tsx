import React, { useCallback } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Typography, Button, IconButton, Badge, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Container, Divider, useMediaQuery, useTheme } from '@mui/material';
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

function App() {
  // Use production API URL for deployed site, localhost for development
  // In Vercel, backend is on same domain at /api, so we use relative path if env var is not set
  const rawApiBase = process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000');
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

// --- Modern Layout with Top Navigation ---
function Layout({ apiBase }: { apiBase: string }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const { setIsCartOpen, cartCount } = useCart();
  const theme = React.useTheme();
  // Use media query to check for desktop/mobile
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const refreshAuthFromStorage = useCallback(() => {
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

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'Products', path: '/products' },
    { text: 'Custom Soap', path: '/custom-soap' },
    { text: 'About', path: '/#about' }, // Placeholder for now
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* --- Top App Bar --- */}
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>

            {/* 1. Mobile Menu Button (Left) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" onClick={() => setMobileOpen(true)} color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>

            {/* 2. Brand Logo (Center on Mobile, Left on Desktop) */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: { xs: 1, md: 0 } }}>
              <img src="/images/home/logo.jpg" alt="Logo" style={{ height: 40, marginRight: 10, borderRadius: '50%' }} />
              <Typography variant="h6" noWrap component={Link} to="/" sx={{
                mr: 2,
                display: { xs: 'flex', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'primary.main',
                textDecoration: 'none',
              }}>
                HERBAL SOAP
              </Typography>
            </Box>

            {/* 3. Desktop Navigation (Center) */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 4 }}>
              {navLinks.map((page) => (
                <Button key={page.text} component={Link} to={page.path} sx={{ my: 2, color: 'text.primary', display: 'block', fontWeight: 500 }}>
                  {page.text}
                </Button>
              ))}
              {isAdmin && (
                <Button component={Link} to="/admin" sx={{ my: 2, color: 'secondary.main', display: 'block', fontWeight: 600 }}>
                  Admin Panel
                </Button>
              )}
            </Box>

            {/* 4. User Actions (Right) */}
            <Box sx={{ flexGrow: 0, display: 'flex', gap: 1 }}>
              <IconButton color="inherit" onClick={() => setIsCartOpen(true)}>
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {userEmail ? (
                <IconButton component={Link} to="/profile" color="primary">
                  <PersonIcon />
                </IconButton>
              ) : (
                <Button variant="outlined" size="small" onClick={() => setLoginOpen(true)} sx={{ ml: 1, borderRadius: 20 }}>
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* --- Mobile Drawer --- */}
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280 }} role="presentation" onClick={() => setMobileOpen(false)}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <img src="/images/home/logo.jpg" alt="Logo" style={{ height: 40, marginRight: 10, borderRadius: '50%' }} />
            <Typography variant="h6" fontWeight="bold">Herbal Soap</Typography>
          </Box>
          <List>
            {navLinks.map((item) => (
              <ListItemButton key={item.text} component={Link} to={item.path}>
                <ListItemIcon><SpaIcon color="secondary" /></ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
            {isAdmin && (
              <ListItemButton component={Link} to="/admin">
                <ListItemIcon><SpaIcon color="error" /></ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </ListItemButton>
            )}
          </List>
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
