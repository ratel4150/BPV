import database from "../config/index.js";


const {Schema} = database
const inventoryMovementSchema = new Schema({
  inventory: { type: Schema.Types.ObjectId, ref: 'Inventory' },
  type: { type: String, enum: ['IN', 'OUT'], required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});
const InventoryMovement = database.model('InventoryMovement', inventoryMovementSchema);
export default InventoryMovement;