import {Router} from 'express';

import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import movimentosRoutes from './movimentacaoRoutes.js'
import relatorioRoutes from './relatorioRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'

const router = Router();

//prefixos de cada rota
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/movimentacao', movimentosRoutes);
router.use('/relatorios', relatorioRoutes)
router.use('/dashboard', dashboardRoutes)

export default router;