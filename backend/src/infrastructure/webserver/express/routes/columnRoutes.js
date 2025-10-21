import express from 'express';
import {
  createColumn,
  getColumns,
  updateColumn,
  deleteColumn,
  reorderColumns
} from '../../../../interfaces/controllers/columnController.js';
import { protect } from '../../../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

router.post('/', createColumn);
router.get('/', getColumns);
router.put('/:id', updateColumn);
router.delete('/:id', deleteColumn);
router.post('/reorder', reorderColumns);

export default router;
