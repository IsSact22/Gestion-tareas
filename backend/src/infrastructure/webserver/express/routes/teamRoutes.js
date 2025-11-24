import express from "express";
import { createTeam, getTeams, getTeamById, updateTeam, deleteTeam, addMemberToTeam, removeMemberFromTeam, getTeamMembers } from "../../../../interfaces/controllers/teamController.js";
import { protect } from "../../../../middleware/authMiddleware.js";
import { isAdmin } from "../../../../middleware/authorizationMiddleware.js";

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

// Rutas públicas (para usuarios autenticados)
router.post("/", createTeam); // Crear team
router.get("/", getTeams); // Obtener teams del usuario o todos si es admin
router.get("/:id", getTeamById); // Obtener team específico
router.put("/:id", updateTeam); // Actualizar team
router.delete("/:id", isAdmin, deleteTeam); // Eliminar team
router.post("/:id/members", addMemberToTeam); // Agregar miembro al team
router.delete("/:id/members/:memberId", removeMemberFromTeam); // Eliminar miembro del team
router.get("/:id/members", getTeamMembers); // Obtener miembros del team

export default router;
