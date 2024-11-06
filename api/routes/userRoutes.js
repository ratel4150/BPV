import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";

const router = express.Router();


router.post("/", createUser); // Crear un nuevo usuario


router.get("/", getAllUsers); // Obtener todos los usuarios


router.get("/:id", getUserById); // Obtener un usuario por ID


router.put("/:id", updateUser); // Actualizar un usuario por ID


router.delete("/:id", deleteUser); // Eliminar un usuario por ID

export default router;
