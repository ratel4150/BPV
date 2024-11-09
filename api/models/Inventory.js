import database from "../config/index.js";

const { Schema } = database;

const inventorySchema = new Schema({
  store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 0 },
});

// Índice compuesto para garantizar que no haya productos duplicados en la misma tienda
inventorySchema.index({ store: 1, product: 1 }, { unique: true });

const Inventory = database.model('Inventory', inventorySchema);

export default Inventory;