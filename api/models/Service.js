import database from "../config/index.js";


const {Schema} = database
const serviceSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
});
const Service = database.model('Service', serviceSchema);
export default Service;