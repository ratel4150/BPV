import database from "../config/index.js";


const {Schema} = database
const promotionSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  discount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});
const Promotion = database.model('Promotion', promotionSchema);
export default Promotion;