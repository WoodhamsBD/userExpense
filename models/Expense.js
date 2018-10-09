const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

// declare model
const expenseSchema = new Schema ({

})


// Export model
module.exports = mongoose.model('Expense', expenseSchema);