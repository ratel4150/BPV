import database from "../config/index.js";


const {Schema} = database
const salesReportSchema = new Schema({
  date: { type: Date, default: Date.now },
  totalSales: { type: Number, required: true },
  itemsSold: { type: Number, required: true },
});
const SalesReport = database.model('SalesReport', salesReportSchema);
export default SalesReport;