import { VercelRequest, VercelResponse } from '@vercel/node';
// import { getDataSource } from '../_lib/db';
// import { requireAdmin, AuthRequest } from '../_lib/auth';
// import { AdminContent } from '../../backend/entities/AdminContent';

function handler(req: VercelRequest, res: VercelResponse) {
    // Mock admin content data for homepage
    const mockContent = {
        home_hero_title: "Welcome to Herbal Soap Works",
        home_hero_subtitle: "Handcrafted with love, nature, and science. Discover our premium collection of natural herbal soaps.",
        home_hero_image: "/uploads/hero-image.jpg",
        home_hero_animation: "fade",
        theme_primary: "#2E3B29",
        theme_secondary: "#C4A484"
    };

    if (req.method === 'GET') {
        return res.status(200).json(mockContent);
    }

    if (req.method === 'POST') {
        // Mock successful update
        return res.status(200).json({ message: 'Content updated successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
}

// export default requireAdmin(handler);
export default handler;
