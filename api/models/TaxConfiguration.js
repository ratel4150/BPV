import database from "../config/index.js";


const {Schema} = database
const taxConfigurationSchema = new Schema({
  name: { type: String, required: true },
  rate: { type: Number, required: true },
});
const TaxConfiguration = database.model('TaxConfiguration', taxConfigurationSchema);
export default TaxConfiguration;