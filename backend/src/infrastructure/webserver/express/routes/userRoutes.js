import express from "express";
import { getAllUsers, getUserById, searchUsers, updateUser } from "../../../../interfaces/controllers/userController.js";
import { protect } from "../../../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

router.get("/", getAllUsers);
router.get("/search", searchUsers);
router.get("/:id", getUserById);
router.put("/profile", updateUser);

export default router;