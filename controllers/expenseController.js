const mongoose = require('mongoose');
const Expense = mongoose.model('Expense');

// Actions
exports.addExpense = (req,res) => {
  res.render('editExpense', {title: 'Add Expense'});
};

exports.createExpense = async (req,res) => {
  req.body.author = req.user._id;
  const expense = await (new Expense(req.body)).save();
  
  req.flash('success', `Expense Added ${expense.name}`)
  res.redirect('/home');
};

exports.getExpenses = async (req,res) => {
  const expenses = await Expense.find();
  res.render('expenses', {title: 'Expenses', expenses});
};

