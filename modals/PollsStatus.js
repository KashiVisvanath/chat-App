const mongoose = require('mongoose');
const Joi = require('@hapi/joi');


const schema = new mongoose.Schema({
  pollId: {
    type: String
  },
  user_email: {
    type: String
  },
  status: {
    type: String
  }
});

const PollsStatus = mongoose.model('polls_status', schema);

module.exports = PollsStatus;