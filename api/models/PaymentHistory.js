import database from "../config/index.js";


const {Schema} = database
const paymentHistorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});
const PaymentHistory = database.model('PaymentHistory', paymentHistorySchema);
export default PaymentHistory;