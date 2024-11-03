import database from "../config/index.js";


const {Schema} = database
const loyaltyTransactionSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  points: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});
const LoyaltyTransaction = database.model('LoyaltyTransaction', loyaltyTransactionSchema);
export default LoyaltyTransaction;