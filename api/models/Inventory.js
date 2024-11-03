import database from "../config/index.js";


const {Schema} = database
const inventorySchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 0 },
});
const Inventory = database.model('Inventory', inventorySchema);
export default Inventory;