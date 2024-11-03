import database from "../config/index.js";


const {Schema} = database
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  active: { type: Boolean, default: true },
});
const User = database.model('User', userSchema);
export default User;