import database from "../config/index.js";
const {Schema} = database
const alertConfigurationSchema = new Schema({
  alertType: { type: String, required: true },
  message: { type: String, required: true },
});
const AlertConfiguration = database.model('AlertConfiguration', alertConfigurationSchema);
export default AlertConfiguration;