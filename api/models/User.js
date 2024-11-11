import database from "../config/index.js";


const {Schema} = database
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true }, // Campo de email agregado
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  active: { type: Boolean, default: true },
  store: { type: Schema.Types.ObjectId, ref: 'Store' }, // Relación con la tienda
});
const User = database.model('User', userSchema);
export default User;