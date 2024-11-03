import database from "../config/index.js";


const {Schema} = database
const cashierSchema = new Schema({
  name: { type: String, required: true },
  shiftStart: { type: Date, default: Date.now },
  shiftEnd: { type: Date },
});
const Cashier = database.model('Cashier', cashierSchema);
export default Cashier;