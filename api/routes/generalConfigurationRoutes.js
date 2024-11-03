import express from 'express';
import {
  createGeneralConfiguration,
  getAllGeneralConfigurations,
  getGeneralConfigurationById,
  updateGeneralConfigurationById,
  deleteGeneralConfigurationById,
} from '../controllers/GeneralConfigurationController.js';

const router = express.Router();

router.post('/', createGeneralConfiguration);
router.get('/', getAllGeneralConfigurations);
router.get('/:id', getGeneralConfigurationById);
router.put('/:id', updateGeneralConfigurationById);
router.delete('/:id', deleteGeneralConfigurationById);

export default router;
