import database from "../config/index.js";


const {Schema} = database
const cashClosureSchema = new Schema({
  cashier: { type: Schema.Types.ObjectId, ref: 'Cashier' },
  startAmount: { type: Number, required: true },
  endAmount: { type: Number, required: true },
  closedAt: { type: Date, default: Date.now },
});
const CashClosure = database.model('CashClosure', cashClosureSchema);
export default CashClosure;