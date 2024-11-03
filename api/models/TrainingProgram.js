import database from "../config/index.js";


const {Schema} = database
const trainingProgramSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  duration: { type: Number, required: true },
});
const TrainingProgram = database.model('TrainingProgram', trainingProgramSchema);
export default TrainingProgram;