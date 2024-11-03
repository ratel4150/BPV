import database from "../config/index.js";


const {Schema} = database
const loyaltyProgramSchema = new Schema({
  name: { type: String, required: true },
  pointsPerDollar: { type: Number, required: true },
});
const LoyaltyProgram = database.model('LoyaltyProgram', loyaltyProgramSchema);
export default LoyaltyProgram;