import React from 'react';
import { Drawer, Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Button, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, items, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <Drawer
            anchor="right"
            open={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
        >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f3e5f5' }}>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                    Your Cart ({items.length})
                </Typography>
                <IconButton onClick={() => setIsCartOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {items.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">Your cart is empty.</Typography>
                        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setIsCartOpen(false)}>
                            Continue Shopping
                        </Button>
                    </Box>
                ) : (
                    <List>
                        {items.map((item) => (
                            <React.Fragment key={item.productId}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.productId)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar src={item.imageUrl} variant="rounded" sx={{ width: 56, height: 56, mr: 2 }} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={item.name}
                                        secondary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                <IconButton size="small" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                                <IconButton size="small" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                                <Typography sx={{ ml: 2, fontWeight: 600 }}>
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Box>

            {items.length > 0 && (
                <Box sx={{ p: 3, bgcolor: '#fafafa', borderTop: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Total</Typography>
                        <Typography variant="h6" color="primary.main" fontWeight={700}>
                            ${cartTotal.toFixed(2)}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<ShoppingCartCheckoutIcon />}
                        onClick={() => {
                            setIsCartOpen(false);
                            navigate('/checkout');
                        }}
                        sx={{ borderRadius: 2, py: 1.5, fontWeight: 700 }}
                    >
                        Checkout
                    </Button>
                </Box>
            )}
        </Drawer>
    );
}
