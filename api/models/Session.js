import database from "../config/index.js";


const {Schema} = database
const sessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  token: { type: String, required: true },
  ipAddress: { type: String },
  device: { type: String },
  location: {
    country: String,
    city: String,
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

sessionSchema.methods.expireSession = function() {
  this.isActive = false;
  return this.save();
};

const Session = database.model('Session', sessionSchema);

export default Session;