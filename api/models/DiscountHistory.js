import database from "../config/index.js";


const {Schema} = database
const discountHistorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  discount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});
const DiscountHistory = database.model('DiscountHistory', discountHistorySchema);
export default DiscountHistory;