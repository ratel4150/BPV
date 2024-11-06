import express from "express";
import {
  createTrainingProgram,
  getAllTrainingPrograms,
  getTrainingProgramById,
  updateTrainingProgram,
  deleteTrainingProgram,
} from "../controllers/TrainingProgramController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TrainingProgram
 *   description: Gestión de programas de entrenamiento
 */

router.post("/", createTrainingProgram);
router.get("/", getAllTrainingPrograms);
router.get("/:id", getTrainingProgramById);
router.put("/:id", updateTrainingProgram);
router.delete("/:id", deleteTrainingProgram);

export default router;
