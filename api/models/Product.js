import database from "../config/index.js";


const {Schema} = database
const productSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  department: { type: Schema.Types.ObjectId, ref: 'Department' },

});
const Product =database.model('Product',productSchema)
export default Product
