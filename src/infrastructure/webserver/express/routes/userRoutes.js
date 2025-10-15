import express from "express";
import { createUser } from "../../../../interfaces/controllers/userController.js";

const router = express.Router();

router.post("/", createUser);

export default router;