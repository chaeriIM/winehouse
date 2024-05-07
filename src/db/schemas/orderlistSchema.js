const { Schema } = require('mongoose');

const OrderlistSchema = new Schema({
  product_num: {
    type: Number,
    required: true,
  },
  product_price: {
    type: Number,
    required: true,
  },
  order_id: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
});

module.exports = OrderlistSchema;