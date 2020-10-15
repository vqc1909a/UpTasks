const express = require('express');
const Router = express.Router();
const usersController = require('../controllers/usersController');
const {redirectSignin} = require('../middlewares/verifyAuthentication');

Router.get('/signup', redirectSignin, usersController.formsignup);
Router.get('/signin', redirectSignin, usersController.formsignin);
Router.get('/reestablecer', redirectSignin, usersController.formrestablecer);
Router.get('/reestablecer/:token', redirectSignin, usersController.formrestablecerpassword);


module.exports = Router; 