import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  createUserController,
  getUserController,
  getMeController,
  getAllUsersController,
  updateUserController,
  deleteUserController
} from "../controllers/userController.js";

const router = Router();

router.get('/me', authMiddleware, getMeController)
router.get('/', authMiddleware, getAllUsersController);
router.get('/:id', authMiddleware, getUserController);
router.post('/', authMiddleware, createUserController);
router.put('/:id', authMiddleware, updateUserController);
router.delete('/:id', authMiddleware, deleteUserController);

export default router;