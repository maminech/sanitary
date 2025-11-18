import { Router } from 'express';
import { seedDatabase } from '../seed';

const router = Router();

/**
 * Seed database endpoint (use once, then disable)
 * GET /api/v1/seed
 */
router.get('/', async (_req, res) => {
  try {
    await seedDatabase();
    res.json({
      success: true,
      message: 'Database seeded successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message,
    });
  }
});

export default router;
