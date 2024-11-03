import database from "../config/index.js";


const {Schema} = database
const sessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});
const Session = database.model('Session', sessionSchema);
export default Session;