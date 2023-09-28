const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  // Add other student properties here
});

module.exports = mongoose.model('Student', studentSchema);
