/* eslint-disable no-undef */
const { Schema } = require('mongoose');

const ImageSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  data: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
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

module.exports = ImageSchema;
