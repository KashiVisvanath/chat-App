const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const optionSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  votes: {
    type: Number,
    default: 0
  }
});

const schema = new mongoose.Schema({
  title : {
    type : String
  },  
  first: optionSchema,
  second: optionSchema,
  third: optionSchema,
  fourth: optionSchema,
  pollId: { 
    type: String,
    required: true
  }
});

const Polls = mongoose.model('polls', schema);

module.exports = Polls;