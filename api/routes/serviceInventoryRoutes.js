import express from "express";
import {
  createServiceInventory,
  getAllServiceInventories,
  getServiceInventoryById,
  updateServiceInventory,
  deleteServiceInventory,
} from "../controllers/serviceInventoryController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ServiceInventory
 *   description: Gestión del inventario de servicios
 */

router.post("/", createServiceInventory);
router.get("/", getAllServiceInventories);
router.get("/:id", getServiceInventoryById);
router.put("/:id", updateServiceInventory);
router.delete("/:id", deleteServiceInventory);

export default router;
