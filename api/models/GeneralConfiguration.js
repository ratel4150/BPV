import database from "../config/index.js";


const {Schema} = database
const generalConfigurationSchema = new Schema({
  key: { type: String, unique: true, required: true },
  value: { type: Schema.Types.Mixed, required: true },
});
const GeneralConfiguration = database.model('GeneralConfiguration', generalConfigurationSchema);
export default GeneralConfiguration;