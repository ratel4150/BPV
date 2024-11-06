import express from "express";
import {
  createTaxConfiguration,
  getAllTaxConfigurations,
  getTaxConfigurationById,
  updateTaxConfiguration,
  deleteTaxConfiguration,
} from "../controllers/TaxConfigurationController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TaxConfiguration
 *   description: Gestión de configuraciones de impuestos
 */

router.post("/", createTaxConfiguration);
router.get("/", getAllTaxConfigurations);
router.get("/:id", getTaxConfigurationById);
router.put("/:id", updateTaxConfiguration);
router.delete("/:id", deleteTaxConfiguration);

export default router;
