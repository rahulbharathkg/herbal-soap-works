import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDbConnection } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const db = await getDbConnection();
  const eventRepo = db.getRepository('Event');

  try {
    const { type, productId, userEmail, metadata } = req.body;
    const ev = eventRepo.create({
      type,
      productId,
      userEmail,
      metadata: metadata ? JSON.stringify(metadata) : undefined
    });
    await eventRepo.save(ev);
    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Events API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
