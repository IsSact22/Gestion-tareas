import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  moveTask,
  addComment,
  deleteComment,
  searchTasks,
  getMyTasks,
  getAllTasksAdmin
} from '../../../../interfaces/controllers/taskController.js';
import { protect } from '../../../../middleware/authMiddleware.js';
import { canEdit, canComment, isAdmin } from '../../../../middleware/authorizationMiddleware.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

// Ruta admin para obtener TODAS las tareas (debe ir antes de /:id)
router.get('/admin/all', isAdmin, getAllTasksAdmin);

// Rutas de lectura (todos los roles pueden ver)
router.get('/', getTasks);
router.get('/search', searchTasks);
router.get('/my-tasks', getMyTasks);
router.get('/:id', getTaskById);

// Rutas de escritura (solo admin y member pueden editar)
router.post('/', canEdit, createTask);
router.put('/:id', canEdit, updateTask);
router.delete('/:id', deleteTask); // Validación de permisos dentro del controlador
router.post('/:id/move', canEdit, moveTask);

// Rutas de comentarios (solo admin y member pueden comentar)
router.post('/:id/comments', canComment, addComment);
router.delete('/:id/comments/:commentId', deleteComment); // Validación dentro del controlador

export default router;
