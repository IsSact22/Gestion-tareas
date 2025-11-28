import express from 'express';
import { getActivities, getMyActivities } from '@/src/interfaces/controllers/activityController.js';
import { protect } from '@/src/middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

router.get('/', getActivities);
router.get('/my-activities', getMyActivities);

export default router;
