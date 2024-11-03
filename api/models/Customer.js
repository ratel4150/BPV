import database from "../config/index.js";


const {Schema} = database
const customerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  address: String,
});
const Customer = database.model('Customer', customerSchema);
export default Customer;