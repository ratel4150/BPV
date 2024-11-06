import express from "express";
import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
} from "../controllers/sessionController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Session
 *   description: Gestión de sesiones de usuario
 */

router.post("/", createSession);
router.get("/", getAllSessions);
router.get("/:id", getSessionById);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

export default router;
