import database from "../config/index.js";


const {Schema} = database
const serviceInventorySchema = new Schema({
  service: { type: Schema.Types.ObjectId, ref: 'Service' },
  quantity: { type: Number, default: 0 },
});
const ServiceInventory = database.model('ServiceInventory', serviceInventorySchema);
export default ServiceInventory;