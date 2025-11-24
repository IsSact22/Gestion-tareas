import express from "express";
import { getAllUsers, getUserById, searchUsers, updateUser, updateUserByAdmin, deleteUser } from "../../../../interfaces/controllers/userController.js";
import { protect } from "../../../../middleware/authMiddleware.js";
import { isAdmin } from "../../../../middleware/authorizationMiddleware.js";

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

// Rutas públicas (para usuarios autenticados)
router.get("/search", searchUsers);
router.put("/profile", updateUser); // Usuario actualiza su propio perfil

// Rutas solo para admins
router.get("/", getAllUsers); // Solo admin puede ver todos los usuarios
router.get("/:id", getUserById); // Cualquiera puede ver un usuario específico
router.put("/:id", isAdmin, updateUserByAdmin); // Solo admin puede actualizar cualquier usuario
router.delete("/:id", isAdmin, deleteUser); // Solo admin puede eliminar usuarios

export default router;