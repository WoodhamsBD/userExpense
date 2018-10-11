const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

// declare model
const expenseSchema = new Schema ({
  name: {
    type: String,
    trim: true,
    required: "Please enter an expense Name"
  },
  description: {
    type: String,
    trim: true
  },
  cost: {
    type: Number,
    required: "Please enter a cost for this expense"
  },
  created_at: {
    type: Date,
    default: Date.now
  },

  // Link to Creator
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an Owner'
  }
});


// Export model
module.exports = mongoose.model('Expense', expenseSchema);