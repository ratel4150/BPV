import database from "../config/index.js";
const {Schema} = database
const departmentSchema = new Schema({
    name: { type: String, required: true },
    description: String,
  });
  const Department = database.model('Department', departmentSchema);
  export default Department;