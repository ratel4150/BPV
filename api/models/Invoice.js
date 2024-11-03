import database from "../config/index.js";


const {Schema} = database
const invoiceSchema = new Schema({
  ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' },
  amount: { type: Number, required: true },
  issuedAt: { type: Date, default: Date.now },
});
const Invoice = database.model('Invoice', invoiceSchema);
export default Invoice;