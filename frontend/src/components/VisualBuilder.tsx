import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Paper, Typography, IconButton, TextField, Button, Grid } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PageBlocks from './PageBlocks';

// Define block types matching PageBlocks
interface Block {
    id: string;
    type: 'hero' | 'grid' | 'text' | 'image';
    content: any;
}

interface VisualBuilderProps {
    initialBlocks: Block[];
    onSave: (blocks: Block[]) => void;
}

function SortableItem(props: { id: string; block: Block; onEdit: () => void; onDelete: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Paper
            ref={setNodeRef}
            style={style}
            sx={{
                p: 2,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                cursor: 'default',
                border: '1px solid #e0e0e0',
                '&:hover': { bgcolor: '#fafafa' }
            }}
        >
            <IconButton {...attributes} {...listeners} sx={{ cursor: 'grab', mr: 2 }}>
                <DragIndicatorIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {props.block.type} Block
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {JSON.stringify(props.block.content).substring(0, 50)}...
                </Typography>
            </Box>
            <IconButton onClick={props.onEdit} color="primary">
                <EditIcon />
            </IconButton>
            <IconButton onClick={props.onDelete} color="error">
                <DeleteIcon />
            </IconButton>
        </Paper>
    );
}

export default function VisualBuilder({ initialBlocks, onSave }: VisualBuilderProps) {
    const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    function addBlock(type: Block['type']) {
        const newBlock: Block = {
            id: `block-${Date.now()}`,
            type,
            content: type === 'hero' ? { title: 'New Hero', subtitle: 'Subtitle', buttonText: 'Shop Now', link: '/products' } :
                type === 'text' ? { text: 'New Text Block' } :
                    type === 'grid' ? { title: 'New Grid' } :
                        { src: '', alt: 'Image' }
        };
        setBlocks([...blocks, newBlock]);
        setEditingBlockId(newBlock.id);
    }

    function updateBlockContent(id: string, newContent: any) {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
    }

    function deleteBlock(id: string) {
        setBlocks(blocks.filter(b => b.id !== id));
        if (editingBlockId === id) setEditingBlockId(null);
    }

    const activeBlock = blocks.find(b => b.id === editingBlockId);

    return (
        <Grid container spacing={4} sx={{ height: 'calc(100vh - 100px)' }}>
            {/* Left Panel: List & Controls */}
            <Grid size={{ xs: 12, md: 4 }} sx={{ height: '100%', overflowY: 'auto', borderRight: '1px solid #eee' }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>Add Block</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {['hero', 'grid', 'text', 'image'].map((type) => (
                            <Button
                                key={type}
                                variant="outlined"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={() => addBlock(type as any)}
                                size="small"
                            >
                                {type}
                            </Button>
                        ))}
                    </Box>
                </Box>

                <Typography variant="h6" gutterBottom>Structure</Typography>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={blocks.map(b => b.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {blocks.map((block) => (
                            <SortableItem
                                key={block.id}
                                id={block.id}
                                block={block}
                                onEdit={() => setEditingBlockId(block.id)}
                                onDelete={() => deleteBlock(block.id)}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                <Box sx={{ mt: 4 }}>
                    <Button variant="contained" fullWidth onClick={() => onSave(blocks)} size="large">
                        Save Layout
                    </Button>
                </Box>
            </Grid>

            {/* Middle Panel: Editor */}
            <Grid size={{ xs: 12, md: 3 }} sx={{ height: '100%', overflowY: 'auto', bgcolor: '#f9f9f9', p: 2 }}>
                <Typography variant="h6" gutterBottom>Edit Block</Typography>
                {activeBlock ? (
                    <Box>
                        <Typography variant="subtitle2" color="primary" gutterBottom sx={{ textTransform: 'uppercase' }}>
                            {activeBlock.type} Settings
                        </Typography>
                        {activeBlock.type === 'hero' && (
                            <>
                                <TextField fullWidth label="Title" value={activeBlock.content.title || ''} onChange={(e) => updateBlockContent(activeBlock.id, { ...activeBlock.content, title: e.target.value })} margin="normal" />
                                <TextField fullWidth label="Subtitle" value={activeBlock.content.subtitle || ''} onChange={(e) => updateBlockContent(activeBlock.id, { ...activeBlock.content, subtitle: e.target.value })} margin="normal" />
                                <TextField fullWidth label="Button Text" value={activeBlock.content.buttonText || ''} onChange={(e) => updateBlockContent(activeBlock.id, { ...activeBlock.content, buttonText: e.target.value })} margin="normal" />
                                <TextField fullWidth label="Link" value={activeBlock.content.link || ''} onChange={(e) => updateBlockContent(activeBlock.id, { ...activeBlock.content, link: e.target.value })} margin="normal" />
                                <TextField fullWidth label="Image URL" value={activeBlock.content.image || ''} onChange={(e) => updateBlockContent(activeBlock.id, { ...activeBlock.content, image: e.target.value })} margin="normal" />
                            </>
                        )}
                        {activeBlock.type === 'text' && (
                            <TextField fullWidth multiline rows={4} label="Content" value={activeBlock.content.text || ''} onChange={(e) => updateBlockContent(activeBlock.id, { ...activeBlock.content, text: e.target.value })} margin="normal" />
                        )}
                        {activeBlock.type === 'grid' && (
                            <TextField fullWidth label="Section Title" value={activeBlock.content.title || ''} onChange={(e) => updateBlockContent(activeBlock.id, { ...activeBlock.content, title: e.target.value })} margin="normal" />
                        )}
                        {activeBlock.type === 'image' && (
                            <>
                                <TextField fullWidth label="Image URL" value={activeBlock.content.src || ''} onChange={(e) => updateBlockContent(activeBlock.id, { ...activeBlock.content, src: e.target.value })} margin="normal" />
                                <TextField fullWidth label="Alt Text" value={activeBlock.content.alt || ''} onChange={(e) => updateBlockContent(activeBlock.id, { ...activeBlock.content, alt: e.target.value })} margin="normal" />
                            </>
                        )}
                    </Box>
                ) : (
                    <Typography color="text.secondary">Select a block to edit its properties.</Typography>
                )}
            </Grid>

            {/* Right Panel: Live Preview */}
            <Grid size={{ xs: 12, md: 5 }} sx={{ height: '100%', overflowY: 'auto', borderLeft: '1px solid #eee', bgcolor: 'white' }}>
                <Box sx={{ borderBottom: '1px solid #eee', p: 1, mb: 1 }}>
                    <Typography variant="overline" color="text.secondary">Live Preview</Typography>
                </Box>
                <Box sx={{ transform: 'scale(0.8)', transformOrigin: 'top center', height: '125%', width: '125%' }}>
                    <PageBlocks layout={blocks} />
                </Box>
            </Grid>
        </Grid>
    );
}
