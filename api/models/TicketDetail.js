import database from "../config/index.js";


const {Schema} = database
const ticketDetailSchema = new Schema({
  ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});
const TicketDetail = database.model('TicketDetail', ticketDetailSchema);
export default TicketDetail;