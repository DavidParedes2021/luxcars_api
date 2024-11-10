const mongoose = require('mongoose');

/*
const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
*/
const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String }] // Array to store image file paths or URLs
});


module.exports = mongoose.model('Car', carSchema);
