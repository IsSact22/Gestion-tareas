import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  moveTask,
  addComment,
  searchTasks,
  getMyTasks
} from '../../../../interfaces/controllers/taskController.js';
import { protect } from '../../../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

router.post('/', createTask);
router.get('/', getTasks);
router.get('/search', searchTasks);
router.get('/my-tasks', getMyTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/move', moveTask);
router.post('/:id/comments', addComment);

export default router;
