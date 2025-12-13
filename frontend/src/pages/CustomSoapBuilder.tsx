import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Chip, Stepper, Step, StepLabel, Divider, Paper, TextField } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

// --- Data Definitions ---

const STEPS = ['Skin Goals', 'Base', 'Ingredients', 'Nourishing Oils', 'Fragrance', 'Boosters', 'Review'];

const SKIN_GOALS = [
    { id: 'acne', label: 'Acne Control', img: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=300&q=80', color: '#e57373' }, // Charcoal/Neem texture (Natural cleansing)
    { id: 'tan', label: 'Tan Removal', img: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=300&q=80', color: '#ffb74d' }, // Bright citrus/sun concept
    { id: 'soft', label: 'Soft Skin', img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=300&q=80', color: '#64b5f6' }, // Creamy lather/foam texture
    { id: 'oil', label: 'Oil Control', img: 'https://images.unsplash.com/photo-1550503043-45bee04f63c8?auto=format&fit=crop&w=300&q=80', color: '#4db6ac' }, // Fresh water splash/cucumber
    { id: 'aging', label: 'Anti-Aging', img: 'https://images.unsplash.com/photo-1526435882660-f3b61cb9431e?auto=format&fit=crop&w=300&q=80', color: '#ba68c8' }, // Orchid/Floral elegance
    { id: 'glow', label: 'Radiant Glow', img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=300&q=80', color: '#ffd54f' }, // Golden oil/honey texture
];

const BASES = [
    { id: 'goat_milk', label: 'Goat Milk', price: 100, desc: 'Rich in vitamins, gentle cleanser.', img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=150&q=80' }, // Milk splash
    { id: 'glycerine', label: 'Glycerine', price: 90, desc: 'Hydrating and clear base.', img: 'https://images.unsplash.com/photo-1609176046029-7c15104d4128?auto=format&fit=crop&w=150&q=80' }, // Clear water/droplet
    { id: 'aloe', label: 'Aloe Vera', price: 110, desc: 'Soothing and healing.', img: 'https://images.unsplash.com/photo-1596046124845-a75d50220641?auto=format&fit=crop&w=150&q=80' }, // Fresh Aloe leaf slice
    { id: 'shea', label: 'Shea Butter', price: 120, desc: 'Deeply moisturizing.', img: 'https://images.unsplash.com/photo-1627932640245-c1bc6be51413?auto=format&fit=crop&w=150&q=80' }, // Creamy butter texture
];

const INGREDIENTS = [
    { id: 'wine', label: 'Red Wine', price: 30, desc: 'Anti-oxidant rich, anti-aging.', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=150&q=80' },
    { id: 'charcoal', label: 'Activated Charcoal', price: 25, desc: 'Detoxifies and cleans pores.', img: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=150&q=80' },
    { id: 'sandalwood', label: 'Sandalwood', price: 40, desc: 'Brightening and cooling.', img: 'https://plus.unsplash.com/premium_photo-1675271813132-723a1c5d0016?auto=format&fit=crop&w=150&q=80' },
    { id: 'manjistha', label: 'Manjistha', price: 35, desc: 'Skin brightening herb.', img: 'https://images.unsplash.com/photo-1621256707328-76508c93540e?auto=format&fit=crop&w=150&q=80' }, // Red powder/roots
    { id: 'coffee', label: 'Coffee', price: 20, desc: 'Exfoliating and energizing.', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=150&q=80' },
    { id: 'neem', label: 'Neem', price: 20, desc: 'Antibacterial and purifying.', img: 'https://images.unsplash.com/photo-1599407335752-6a84d436151c?auto=format&fit=crop&w=150&q=80' },
    { id: 'honey', label: 'Honey', price: 25, desc: 'Natural humectant.', img: 'https://images.unsplash.com/photo-1587049352851-8d4e89186eff?auto=format&fit=crop&w=150&q=80' },
    { id: 'multani', label: 'Multani Mitti', price: 15, desc: 'Oil absorption.', img: 'https://plus.unsplash.com/premium_photo-1675402094895-3ca325712530?auto=format&fit=crop&w=150&q=80' },
];

const OILS = [
    { id: 'almond', label: 'Almond Oil', price: 30, desc: 'Vitamin E rich.', img: 'https://images.unsplash.com/photo-1620917670397-a3313437ee8f?auto=format&fit=crop&w=150&q=80' }, // Oil drop
    { id: 'coconut', label: 'Coconut Oil', price: 20, desc: 'Deeply nourishing.', img: 'https://images.unsplash.com/photo-1599298708304-749e49bef345?auto=format&fit=crop&w=150&q=80' },
    { id: 'olive', label: 'Olive Oil', price: 25, desc: 'Moisturizing.', img: 'https://images.unsplash.com/photo-1474979266404-7cadd259d3d2?auto=format&fit=crop&w=150&q=80' },
    { id: 'castor', label: 'Castor Oil', price: 20, desc: 'Promotes healing.', img: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=150&q=80' },
];

const FRAGRANCES = [
    { id: 'sandal_oil', label: 'Sandalwood Oil', price: 50, desc: 'Classic woody scent.', img: 'https://plus.unsplash.com/premium_photo-1675271813132-723a1c5d0016?auto=format&fit=crop&w=150&q=80' },
    { id: 'vanilla', label: 'Vanilla', price: 40, desc: 'Sweet and comforting.', img: 'https://images.unsplash.com/photo-1606132777176-6c1743f54d4f?auto=format&fit=crop&w=150&q=80' },
    { id: 'rose', label: 'Rose', price: 45, desc: 'Floral and romantic.', img: 'https://images.unsplash.com/photo-1559563362-c667ca5f5418?auto=format&fit=crop&w=150&q=80' },
    { id: 'lavender', label: 'Lavender', price: 40, desc: 'Calming and relaxing.', img: 'https://images.unsplash.com/photo-1595166687060-72ee9832c382?auto=format&fit=crop&w=150&q=80' },
    { id: 'tea_tree', label: 'Tea Tree', price: 35, desc: 'Medicinal and fresh.', img: 'https://images.unsplash.com/photo-1598273615467-f4e912f20bd6?auto=format&fit=crop&w=150&q=80' },
];

const BOOSTERS = [
    { id: 'retinol', label: 'Retinol', price: 150, desc: 'Anti-aging powerhouse.', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80' }, // Elegant serum drop
    { id: 'hyaluronic', label: 'Hyaluronic Acid', price: 120, desc: 'Intense hydration.', img: 'https://images.unsplash.com/photo-1608677464195-2d4e78a63583?auto=format&fit=crop&w=150&q=80' }, // Texture focus
    { id: 'niacinamide', label: 'Niacinamide', price: 100, desc: 'Pore refining.', img: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=150&q=80' }, // Fresh clean look
    { id: 'vit_e', label: 'Vitamin E', price: 80, desc: 'Skin repair.', img: 'https://images.unsplash.com/photo-1615484477780-3f95038ecf5f?auto=format&fit=crop&w=150&q=80' }, // Golden oil texture, NOT pills
];

export default function CustomSoapBuilder({ apiBase }: { apiBase: string }) {
    const [activeStep, setActiveStep] = useState(0);
    const [customName, setCustomName] = useState('');
    const [selections, setSelections] = useState<{
        goals: string[];
        base: string | null;
        ingredients: string[];
        oils: string[];
        fragrance: string | null;
        boosters: string[];
    }>({
        goals: [],
        base: null,
        ingredients: [],
        oils: [],
        fragrance: null,
        boosters: [],
    });

    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleToggle = (category: keyof typeof selections, id: string, single = false) => {
        setSelections(prev => {
            const current = prev[category];
            if (single) {
                return { ...prev, [category]: current === id ? null : id };
            }
            const list = current as string[];
            const exists = list.includes(id);
            return {
                ...prev,
                [category]: exists ? list.filter(item => item !== id) : [...list, id]
            };
        });
    };

    const calculateTotal = () => {
        let total = 0;
        if (selections.base) total += BASES.find(b => b.id === selections.base)?.price || 0;
        selections.ingredients.forEach(id => total += INGREDIENTS.find(i => i.id === id)?.price || 0);
        selections.oils.forEach(id => total += OILS.find(i => i.id === id)?.price || 0);
        if (selections.fragrance) total += FRAGRANCES.find(f => f.id === selections.fragrance)?.price || 0;
        selections.boosters.forEach(id => total += BOOSTERS.find(b => b.id === id)?.price || 0);
        return total;
    };

    const handleAddToCart = () => {
        const total = calculateTotal();
        const description = [
            `Base: ${BASES.find(b => b.id === selections.base)?.label}`,
            `Ingredients: ${selections.ingredients.map(id => INGREDIENTS.find(i => i.id === id)?.label).join(', ')}`,
            `Oils: ${selections.oils.map(id => OILS.find(i => i.id === id)?.label).join(', ')}`,
            `Fragrance: ${FRAGRANCES.find(f => f.id === selections.fragrance)?.label}`,
            `Boosters: ${selections.boosters.map(id => BOOSTERS.find(b => b.id === id)?.label).join(', ')}`
        ].filter(Boolean).join(' | ');

        addToCart({
            id: `custom-${Date.now()}`,
            name: customName || 'Custom Herbal Soap',
            price: total,
            imageUrl: BASES.find(b => b.id === selections.base)?.img || 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=400&q=80',
            description: description,
            quantity: 1
        });
        navigate('/checkout');
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0: // Goals
                return (
                    <Grid container spacing={2}>
                        {SKIN_GOALS.map(goal => (
                            <Grid size={{ xs: 6, sm: 4 }} key={goal.id}>
                                <SelectionCard
                                    selected={selections.goals.includes(goal.id)}
                                    onClick={() => handleToggle('goals', goal.id)}
                                    title={goal.label}
                                    img={goal.img}
                                    color={goal.color}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 1: // Base
                return (
                    <Grid container spacing={2}>
                        {BASES.map(base => (
                            <Grid size={{ xs: 6, sm: 4 }} key={base.id}>
                                <ProductCard
                                    selected={selections.base === base.id}
                                    onClick={() => handleToggle('base', base.id, true)}
                                    item={base}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 2: // Ingredients
                return (
                    <Grid container spacing={2}>
                        {INGREDIENTS.map(item => (
                            <Grid size={{ xs: 6, sm: 4 }} key={item.id}>
                                <ProductCard
                                    selected={selections.ingredients.includes(item.id)}
                                    onClick={() => handleToggle('ingredients', item.id)}
                                    item={item}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 3: // Oils
                return (
                    <Grid container spacing={2}>
                        {OILS.map(item => (
                            <Grid size={{ xs: 6, sm: 4 }} key={item.id}>
                                <ProductCard
                                    selected={selections.oils.includes(item.id)}
                                    onClick={() => handleToggle('oils', item.id)}
                                    item={item}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 4: // Fragrance
                return (
                    <Grid container spacing={2}>
                        {FRAGRANCES.map(item => (
                            <Grid size={{ xs: 6, sm: 4 }} key={item.id}>
                                <ProductCard
                                    selected={selections.fragrance === item.id}
                                    onClick={() => handleToggle('fragrance', item.id, true)}
                                    item={item}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 5: // Boosters
                return (
                    <Grid container spacing={2}>
                        {BOOSTERS.map(item => (
                            <Grid size={{ xs: 6, sm: 4 }} key={item.id}>
                                <ProductCard
                                    selected={selections.boosters.includes(item.id)}
                                    onClick={() => handleToggle('boosters', item.id)}
                                    item={item}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 6: // Review
                return (
                    <Box>
                        <Typography variant="h5" gutterBottom>Your Custom Creation</Typography>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f3e5f5', borderRadius: 4 }}>
                            <TextField
                                fullWidth
                                label="Name Your Soap"
                                variant="outlined"
                                value={customName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomName(e.target.value)}
                                sx={{ mb: 2, bgcolor: 'white' }}
                                placeholder="e.g., Morning Zest"
                            />
                            <Typography variant="subtitle1"><strong>Base:</strong> {BASES.find(b => b.id === selections.base)?.label || 'None'}</Typography>
                            <Typography variant="subtitle1"><strong>Ingredients:</strong> {selections.ingredients.map(id => INGREDIENTS.find(i => i.id === id)?.label).join(', ') || 'None'}</Typography>
                            <Typography variant="subtitle1"><strong>Oils:</strong> {selections.oils.map(id => OILS.find(i => i.id === id)?.label).join(', ') || 'None'}</Typography>
                            <Typography variant="subtitle1"><strong>Fragrance:</strong> {FRAGRANCES.find(f => f.id === selections.fragrance)?.label || 'None'}</Typography>
                            <Typography variant="subtitle1"><strong>Boosters:</strong> {selections.boosters.map(id => BOOSTERS.find(b => b.id === id)?.label).join(', ') || 'None'}</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h4" color="primary">Total: ₹{calculateTotal()}</Typography>
                        </Paper>
                    </Box>
                );
            default:
                return null;
        }
    };

    const validateStep = (step: number) => {
        switch (step) {
            case 1: // Base
                return !!selections.base;
            case 2: // Ingredients
                return selections.ingredients.length > 0;
            case 3: // Oils
                return selections.oils.length > 0;
            default:
                return true;
        }
    };

    const canProceed = validateStep(activeStep);

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto', minHeight: '80vh' }}>
            <Typography variant="h3" align="center" sx={{ mb: 4, fontWeight: 700, color: '#4a148c' }}>
                Build Your Custom Soap
            </Typography>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {STEPS.map((label, index) => (
                            <Step key={label}>
                                <StepLabel error={activeStep > index && !validateStep(index)}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Box sx={{ minHeight: 400 }}>
                                {renderStepContent(activeStep)}
                            </Box>
                        </motion.div>
                    </AnimatePresence>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={() => setActiveStep(prev => prev - 1)}
                            startIcon={<ArrowBackIcon />}
                        >
                            Back
                        </Button>
                        {activeStep === STEPS.length - 1 ? (
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleAddToCart}
                                startIcon={<AddCircleOutlineIcon />}
                                disabled={!customName}
                            >
                                Add to Cart - ₹{calculateTotal()}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={() => setActiveStep(prev => prev + 1)}
                                endIcon={<ArrowForwardIcon />}
                                disabled={!canProceed}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                    {!canProceed && (
                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
                            Please make a selection to proceed.
                        </Typography>
                    )}
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ position: 'sticky', top: 20, borderRadius: 4, boxShadow: 3, overflow: 'visible' }}>
                        <Box sx={{ position: 'relative', height: 200, bgcolor: '#f3e5f5', borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden' }}>
                            {/* Visual Representation of Mix */}
                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', opacity: 0.8 }}>
                                {selections.base && (
                                    <motion.div initial={{ y: 100 }} animate={{ y: 0 }} style={{ position: 'absolute', bottom: 0, width: '100%', height: '80%', background: 'linear-gradient(to top, #fffdd0, transparent)', zIndex: 1 }} />
                                )}
                                {selections.ingredients.map((id, i) => (
                                    <motion.div key={id} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', bottom: 20 + (i * 10), left: 20 + (i * 20), fontSize: '2rem', zIndex: 2 }}>
                                        {INGREDIENTS.find(item => item.id === id)?.label.charAt(0)}
                                    </motion.div>
                                ))}
                                <img src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=600&q=80" alt="Soap Mix" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                            </Box>
                        </Box>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Live Mix</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selections.base && <Chip label={BASES.find(b => b.id === selections.base)?.label} size="small" color="primary" />}
                                {selections.ingredients.map(id => (
                                    <Chip key={id} label={INGREDIENTS.find(i => i.id === id)?.label} size="small" />
                                ))}
                                {selections.oils.map(id => (
                                    <Chip key={id} label={OILS.find(i => i.id === id)?.label} size="small" variant="outlined" />
                                ))}
                            </Box>
                            <Typography variant="h5" sx={{ mt: 2, textAlign: 'right', fontWeight: 'bold' }}>
                                ₹{calculateTotal()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

function SelectionCard({ selected, onClick, title, img, color }: any) {
    return (
        <Card
            onClick={onClick}
            sx={{
                cursor: 'pointer',
                border: selected ? `2px solid ${color}` : '2px solid transparent',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                height: 180,
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
            }}
        >
            <CardMedia
                component="img"
                height="100%"
                image={img}
                alt={title}
                sx={{ filter: selected ? 'brightness(0.7)' : 'brightness(1)', transition: '0.3s' }}
            />
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', p: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>{title}</Typography>
            </Box>
            {selected && <CheckCircleIcon sx={{ color: 'white', position: 'absolute', top: 8, right: 8, zIndex: 2 }} />}
        </Card>
    );
}

function ProductCard({ selected, onClick, item }: any) {
    return (
        <Card
            onClick={onClick}
            sx={{
                cursor: 'pointer',
                border: selected ? '2px solid #4a148c' : '2px solid transparent',
                bgcolor: selected ? '#f3e5f5' : 'background.paper',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 3
            }}
        >
            <CardMedia component="img" height="120" image={item.img} alt={item.label} />
            <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.label}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">{item.desc}</Typography>
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>+₹{item.price}</Typography>
            </CardContent>
            {selected && <CheckCircleIcon color="primary" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', borderRadius: '50%' }} />}
        </Card>
    );
}
