import express from 'express';
import {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  addMember,
  removeMember,
  getAllBoardsAdmin
} from '../../../../interfaces/controllers/boardController.js';
import { protect } from '../../../../middleware/authMiddleware.js';
import { isAdmin } from '../../../../middleware/authorizationMiddleware.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

// Ruta admin para obtener TODOS los boards
router.get('/admin/all', isAdmin, getAllBoardsAdmin);

router.post('/', createBoard);
router.get('/', getBoards);
router.get('/:id', getBoardById);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

export default router;
