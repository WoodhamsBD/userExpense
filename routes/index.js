const { catchErrors } = require('../handlers/errorHandlers');
const express = require('express');
const router = express.Router();

// Controller Imports
const staticController = require('../controllers/staticController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const expenseController = require('../controllers/expenseController');


// Routes

// Homepage
router.get('/', staticController.homepage);

// User Register
router.get('/register', userController.registerForm);
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

// Login
router.get('/login', userController.loginForm);
router.get('/logout', authController.logout);
router.post('/login', authController.login);

// Account
router.get('/account', authController.loggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

// Home
router.get('/home', userController.home);

// Expense Routes
router.get('/addExpense', authController.loggedIn, expenseController.addExpense);
router.post('/addExpense', catchErrors(expenseController.createExpense));

router.get('/expenses', authController.loggedIn, catchErrors(expenseController.getExpenses));

module.exports = router;
