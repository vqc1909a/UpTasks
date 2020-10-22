const express = require('express');
const Router = express.Router();
const authController = require('../controllers/authController');
const authValidate = require('../validations/authValidate');
const passport = require('passport');

Router.post('/signin', authValidate.loguearse, authController.loguearse, passport.authenticate('local', {
     successRedirect: '/',
     failureRedirect: '/signin',
     failureFlash: true,
     badRequestMessage: "Ambos campos son obligatorios"
}));

//!Esto era en caso de que al momento de registrarme ingrese diretamente a la aplicacion, pero en otras ocasiones puede hacerlo mas seguro para verificar que ese gamil exista en el mundo real, para eso le enviamos un correo para que confirme su cuenta
// Router.post('/signup', authValidate.registrarse, authController.registrarse, passport.authenticate('local', {
//      successRedirect: '/',
//      failureRedirect: '/signup',
//      failureFlash: true,
//      badRequestMessage: "Los campos son obligatorios"
// }));
Router.post('/signup', authValidate.registrarse, authController.registrarse)
Router.get('/confirmar/:email', authController.confirmarCuenta);


Router.get('/logout', authController.logout);
Router.post('/reestablecer', authValidate.generarToken, authController.generarToken);
Router.post('/reestablecer/:token', authValidate.actualizarPassword, authController.actualizarPassword);

//Auth with Google
Router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

//Google auth callback
Router.get('/auth/google/callback', passport.authenticate('google', { 
     successRedirect: '/',
     failureRedirect: '/signin',
     failureFlash: true,
     badRequestMessage: "Ambos campos son obligatorios"
}));


//Auth with Facebook
Router.get('/auth/facebook', passport.authenticate('facebook'));

//Facebook auth Callback
Router.get('/auth/facebook/callback', passport.authenticate('facebook', {
     successRedirect: '/',
     failureRedirect: '/signin',
     failureFlash: true,
     badRequestMessage: "Ambos campos son obligatorios"
}))
module.exports = Router;