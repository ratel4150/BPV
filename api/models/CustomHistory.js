import database from "../config/index.js";


const {Schema} = database
const customerHistorySchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  events: [{ type: String }],
  date: { type: Date, default: Date.now },
});
const CustomerHistory = database.model('CustomerHistory', customerHistorySchema);
export default CustomerHistory;