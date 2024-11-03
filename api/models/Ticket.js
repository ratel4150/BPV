import database from "../config/index.js";


const {Schema} = database
const ticketSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  cashier: { type: Schema.Types.ObjectId, ref: 'Cashier' },
  details: [{ type: Schema.Types.ObjectId, ref: 'TicketDetail' }],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Ticket = database.model('Ticket', ticketSchema);
export default Ticket;