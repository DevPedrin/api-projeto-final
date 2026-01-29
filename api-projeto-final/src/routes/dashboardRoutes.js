import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getDashboardDataController } from '../controllers/dashboardController.js';

const router = Router();


router.get('/', authMiddleware, getDashboardDataController);

export default router;