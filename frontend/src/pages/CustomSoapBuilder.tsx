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
    { id: 'acne', label: 'Acne Control', icon: '🌿', color: '#e57373' },
    { id: 'tan', label: 'Tan Removal', icon: '☀️', color: '#ffb74d' },
    { id: 'soft', label: 'Soft Skin', icon: '☁️', color: '#64b5f6' },
    { id: 'oil', label: 'Oil Control', icon: '💧', color: '#4db6ac' },
    { id: 'aging', label: 'Anti-Aging', icon: '⏳', color: '#ba68c8' },
    { id: 'glow', label: 'Radiant Glow', icon: '✨', color: '#ffd54f' },
];

const BASES = [
    { id: 'goat_milk', label: 'Goat Milk', price: 100, desc: 'Rich in vitamins, gentle cleanser.', img: 'https://placehold.co/150x150/FFFDD0/333?text=Goat+Milk' },
    { id: 'glycerine', label: 'Glycerine', price: 90, desc: 'Hydrating and clear base.', img: 'https://placehold.co/150x150/e0f7fa/333?text=Glycerine' },
    { id: 'aloe', label: 'Aloe Vera', price: 110, desc: 'Soothing and healing.', img: 'https://placehold.co/150x150/c8e6c9/333?text=Aloe+Vera' },
    { id: 'shea', label: 'Shea Butter', price: 120, desc: 'Deeply moisturizing.', img: 'https://placehold.co/150x150/efebe9/333?text=Shea+Butter' },
];

const INGREDIENTS = [
    { id: 'wine', label: 'Red Wine', price: 30, desc: 'Anti-oxidant rich, anti-aging.', img: 'https://placehold.co/100x100/880e4f/fff?text=Wine' },
    { id: 'charcoal', label: 'Activated Charcoal', price: 25, desc: 'Detoxifies and cleans pores.', img: 'https://placehold.co/100x100/212121/fff?text=Charcoal' },
    { id: 'sandalwood', label: 'Sandalwood', price: 40, desc: 'Brightening and cooling.', img: 'https://placehold.co/100x100/d7ccc8/333?text=Sandal' },
    { id: 'manjistha', label: 'Manjistha', price: 35, desc: 'Skin brightening herb.', img: 'https://placehold.co/100x100/b71c1c/fff?text=Manjistha' },
    { id: 'coffee', label: 'Coffee', price: 20, desc: 'Exfoliating and energizing.', img: 'https://placehold.co/100x100/3e2723/fff?text=Coffee' },
    { id: 'neem', label: 'Neem', price: 20, desc: 'Antibacterial and purifying.', img: 'https://placehold.co/100x100/388e3c/fff?text=Neem' },
    { id: 'honey', label: 'Honey', price: 25, desc: 'Natural humectant.', img: 'https://placehold.co/100x100/ffecb3/333?text=Honey' },
    { id: 'multani', label: 'Multani Mitti', price: 15, desc: 'Oil absorption.', img: 'https://placehold.co/100x100/d7ccc8/333?text=Multani' },
];

const OILS = [
    { id: 'almond', label: 'Almond Oil', price: 30, desc: 'Vitamin E rich.', img: 'https://placehold.co/100x100/ffe0b2/333?text=Almond' },
    { id: 'coconut', label: 'Coconut Oil', price: 20, desc: 'Deeply nourishing.', img: 'https://placehold.co/100x100/e0f7fa/333?text=Coconut' },
    { id: 'olive', label: 'Olive Oil', price: 25, desc: 'Moisturizing.', img: 'https://placehold.co/100x100/f0f4c3/333?text=Olive' },
    { id: 'castor', label: 'Castor Oil', price: 20, desc: 'Promotes healing.', img: 'https://placehold.co/100x100/fff3e0/333?text=Castor' },
];

const FRAGRANCES = [
    { id: 'sandal_oil', label: 'Sandalwood Oil', price: 50, desc: 'Classic woody scent.', img: 'https://placehold.co/100x100/d7ccc8/333?text=Sandal+Oil' },
    { id: 'vanilla', label: 'Vanilla', price: 40, desc: 'Sweet and comforting.', img: 'https://placehold.co/100x100/fff8e1/333?text=Vanilla' },
    { id: 'rose', label: 'Rose', price: 45, desc: 'Floral and romantic.', img: 'https://placehold.co/100x100/f8bbd0/333?text=Rose' },
    { id: 'lavender', label: 'Lavender', price: 40, desc: 'Calming and relaxing.', img: 'https://placehold.co/100x100/d1c4e9/333?text=Lavender' },
    { id: 'tea_tree', label: 'Tea Tree', price: 35, desc: 'Medicinal and fresh.', img: 'https://placehold.co/100x100/b2dfdb/333?text=Tea+Tree' },
];

const BOOSTERS = [
    { id: 'retinol', label: 'Retinol', price: 150, desc: 'Anti-aging powerhouse.', img: 'https://placehold.co/100x100/ce93d8/fff?text=Retinol' },
    { id: 'hyaluronic', label: 'Hyaluronic Acid', price: 120, desc: 'Intense hydration.', img: 'https://placehold.co/100x100/e1f5fe/333?text=Hyaluronic' },
    { id: 'niacinamide', label: 'Niacinamide', price: 100, desc: 'Pore refining.', img: 'https://placehold.co/100x100/f3e5f5/333?text=Niacinamide' },
    { id: 'vit_e', label: 'Vitamin E', price: 80, desc: 'Skin repair.', img: 'https://placehold.co/100x100/fff9c4/333?text=Vit+E' },
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
            imageUrl: 'https://placehold.co/600x400/e0c3fc/4a148c?text=Custom+Soap',
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
                                    icon={goal.icon}
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
                                <img src="https://placehold.co/600x400/e0c3fc/4a148c?text=Soap+Mix" alt="Soap Mix" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
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

function SelectionCard({ selected, onClick, title, icon, color }: any) {
    return (
        <Card
            onClick={onClick}
            sx={{
                cursor: 'pointer',
                border: selected ? `2px solid ${color}` : '2px solid transparent',
                bgcolor: selected ? `${color}22` : 'background.paper',
                transition: 'all 0.2s',
                textAlign: 'center',
                p: 2,
                borderRadius: 3
            }}
        >
            <Typography variant="h2">{icon}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>{title}</Typography>
            {selected && <CheckCircleIcon sx={{ color, position: 'absolute', top: 8, right: 8 }} />}
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
            <CardMedia component="img" height="100" image={item.img} alt={item.label} />
            <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.label}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">{item.desc}</Typography>
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>+₹{item.price}</Typography>
            </CardContent>
            {selected && <CheckCircleIcon color="primary" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', borderRadius: '50%' }} />}
        </Card>
    );
}
