import database from "../config/index.js";


const {Schema} = database
const auditSchema = new Schema({
  action: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});
const Audit = database.model('Audit', auditSchema);
export default Audit;