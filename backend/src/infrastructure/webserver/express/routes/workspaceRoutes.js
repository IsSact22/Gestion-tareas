import express from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
  getAllWorkspacesAdmin
} from '../../../../interfaces/controllers/workspaceController.js';
import { protect } from '../../../../middleware/authMiddleware.js';
import { isAdmin } from '../../../../middleware/authorizationMiddleware.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

// Ruta admin para obtener TODOS los workspaces
router.get('/admin/all', isAdmin, getAllWorkspacesAdmin);

router.post('/', createWorkspace);
router.get('/', getWorkspaces);
router.get('/:id', getWorkspaceById);
router.put('/:id', updateWorkspace);
router.delete('/:id', deleteWorkspace);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

export default router;
