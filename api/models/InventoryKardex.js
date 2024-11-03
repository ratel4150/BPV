import database from "../config/index.js";


const {Schema} = database
const inventoryKardexSchema = new Schema({
  inventory: { type: Schema.Types.ObjectId, ref: 'Inventory' },
  movements: [{ type: Schema.Types.ObjectId, ref: 'InventoryMovement' }],
});
const InventoryKardex = database.model('InventoryKardex', inventoryKardexSchema);
export default InventoryKardex;