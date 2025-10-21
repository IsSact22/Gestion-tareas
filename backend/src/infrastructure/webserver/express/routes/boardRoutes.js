import express from 'express';
import {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  addMember,
  removeMember
} from '../../../../interfaces/controllers/boardController.js';
import { protect } from '../../../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

router.post('/', createBoard);
router.get('/', getBoards);
router.get('/:id', getBoardById);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

export default router;
