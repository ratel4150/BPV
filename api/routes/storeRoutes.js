import express from 'express';
import {
  createStore,
  updateStore,
  getAllStores,
  getStoreById,
  deleteStore
} from '../controllers/StoreController.js';

const router = express.Router();


router.post('/', createStore);


router.put('/:id', updateStore);

router.get('/', getAllStores);

router.get('/:id', getStoreById);

router.delete('/:id', deleteStore);

export default router;
