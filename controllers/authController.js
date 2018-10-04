const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

// Controller Actions
exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'Logged in!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
};

exports.loggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'You must be logged in!');
  res.redirect('/login');
};

exports.forgot = async (req, res) => {
  // Check for user with supplied email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'No account with that email exists');
    return res.redirect('/login');
  }
  // Set reset tokens and expire on user account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hr from now
  await user.save();
  // Send email with token
  const resetURL = `http://${req.headers.host}.account/reset/${user.resetPasswordToken}`;

  await mail.send({
    user: user,
    filename: 'password-reset',
    subject: 'Password Reset',
    resetURL
  });

  req.flash('success', 'You have been emailed a reset link.');
  // redirect to login after email token sent
  res.redirect('/login');
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Password reset token invalid or exprired')
    return res.redirect('/login');
  }

  res.render('reset', { title: 'Reset Password' });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body[password - confirm]) {
    next();
    return;
  }
  req.flash('error', 'Passwords do not match')
  res.redirect('back');
  ;
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Password reset token invalid or exprired')
    return res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  // Now send save otherwise won't update
  const updatedUser = await user.save();

  await req.login(updatedUser);
  req.flash('success', 'Your password has been reset');
  req.redirect('/');
};