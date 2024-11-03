import database from "../config/index.js";


const {Schema} = database
const roleSchema = new Schema({
  name: { type: String, required: true },
  permissions: [String],
});
const Role = database.model('Role', roleSchema);
export default Role;