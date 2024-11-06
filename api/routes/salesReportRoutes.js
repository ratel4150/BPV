import express from "express";
import {
  createSalesReport,
  getAllSalesReports,
  getSalesReportById,
  updateSalesReport,
  deleteSalesReport,
} from "../controllers/salesReportController.js";

const router = express.Router();

router.post("/", createSalesReport);

router.get("/", getAllSalesReports);

router.get("/:id", getSalesReportById);

router.put("/:id", updateSalesReport);


 
router.delete("/:id", deleteSalesReport);

export default router;
