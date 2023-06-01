const mongoose = require('mongoose');

const messagingSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  reciepient: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('Message', messagingSchema)