import express from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember
} from '../../../../interfaces/controllers/workspaceController.js';
import { protect } from '../../../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

router.post('/', createWorkspace);
router.get('/', getWorkspaces);
router.get('/:id', getWorkspaceById);
router.put('/:id', updateWorkspace);
router.delete('/:id', deleteWorkspace);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

export default router;
