const { validationResult } = require("express-validator");
const User = require("../models/UserModel");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const {Op} = require('sequelize');

const enviarEmail = require('../handlers/emailHandler');

exports.loguearse = async (req, res, next) => {
     const errors = validationResult(req);
     if (errors.errors.length !== 0) {
          return res.render("signinView", {
               nombrepagina: "Signin - UpTasks",
               error: errors.array()[0].msg,
               body: req.body,
          });
     }
     try{
          const user = await User.findOne({where: {email: req.body.email, activo: 1}})
          if(!user){
               return res.render('signinView', {
                    nombrepagina: "Signin - UpTasks",
                    error: "Esa cuenta no esta registrada",
                    body: req.body
               })
          }
          if(!user.verificarPassword(req.body.password)){
               return res.render('signinView', {
                    nombrepagina: "Signin - UpTasks",
                    error: "Password Incorrecto",
                    body: req.body
               })
          }
          next();
     }catch(err){
          console.log(err.message);
          return res.render('signinView', {
               nombrepagina: "Signin - UpTasks",
               error: "Hubo un error",
               body: req.body
          })
     }
}

exports.registrarse = async (req, res, next) => {
     const errors = validationResult(req);
     let error;
     if (errors.errors.length !== 0) {
          error = errors.array()[0].msg;
          return res.render("signupView", {
               nombrepagina: "Signup - UpTasks",
               error,
               body: req.body
          })
     }
     if (req.body.password !== req.body.confirm) {
          return res.render("signupView", {
               nombrepagina: "Signup - UpTasks",
               error: "Los password deben coincidir",
               body: req.body
          })
     }
     try {
          const email = await User.findOne({
               where: {
                    email: req.body.email
               }
          });
          if (email) {
               return res.render("signupView", {
                    nombrepagina: "Signup - UpTasks",
                    error: "El email ya ha sido registrado ó Email sin confirmar",
                    body: req.body
               })
          }

          const user = await User.create(req.body);

          const confirmarUrl = `${req.protocol}://${req.headers.host}/confirmar/${user.email}`;

          await enviarEmail({
               correo: user.email,
               asunto: "Confirmar Cuenta",
               archivo: "confirmarCuentaView",
               url: {confirmarUrl}
          })
          req.flash('success', 'Confirma tu cuenta en tu correo para poder iniciar sesión');
          return res.redirect('/signin');
     } catch (err) {
          console.log(err.message);
          return res.render("signupView", {
               nombrepagina: "Signup - UpTasks",
               error: "Hubo un error",
               body: req.body
          })
     }

}

exports.confirmarCuenta = async (req, res) => {
     try{
          const user = await User.findOne({where: {email: req.params.email}});
          if(!user){
               req.flash('error', 'Tienes que crear un cuenta antes de confirmar')
               return res.redirect('/signup');
          }
          if(user.activo === 1){
               req.flash('success', "Tu cuenta ya ha sido confirmada");
               return res.redirect('/signin');
          }else{
               user.activo = 1;
               await user.save();
               req.flash('success', "Tu cuenta ha sido confirmada exitosamente");
               return res.redirect('/signin');
          }
     }catch(err){
          console.log(err.message);
          req.flash('error', 'Hubo un error, Vuelve a tu correo a confirmar tu cuenta');
          return res.redirect('/signin');
     }
}

exports.logout = (req, res) => {
     req.session.destroy(() => {
          return res.redirect('/signin');
     })
}

exports.generarToken = async (req, res) => {
     const errors = validationResult(req);
     let error;
     if(errors.errors.length !== 0){
          error = errors.array()[0].msg;
     }
     if(error){
          return res.render('restablecerView', {
               nombrepagina: "Reestablecer Contraseña",
               body: req.body,
               error
          })
     }

     try{
          const user = await User.findOne({where: {email: req.body.email}})

          if(!user){
               req.flash('error', "Cuenta no registrada o cuenta sin confirmar");
               return res.redirect('/reestablecer')
          }    

          user.token = crypto.randomBytes(20).toString('hex');
          user.expiracion = Date.now() + 3600000 /* milisegundos  */
          await user.save();


          //!Url de reset
          const resetUrl = `${req.protocol}://${req.headers.host}/reestablecer/${user.token}`;
          //Enviar email
          await enviarEmail({
               correo: user.email,
               asunto: "Reset Password",
               archivo: "redirigirRestablecerPasswordView",
               url: {resetUrl}
          });
          req.flash('success', "Se envió un mensaje a tu correo");
          res.redirect('/signin')
     }catch(err){
          console.log(err.message);
          return res.render('restablecerView', {
               nombrepagina: "Reestablecer Contraseña",
               body: req.body,
               error: "Hubo un error" 
          })
     }
}

exports.actualizarPassword = async (req, res) => {
     const errors = validationResult(req);
     let error;
     if(errors.errors.length !== 0){
          error = errors.array()[0].msg;
     }
     if(error){
          return res.render('restablecerPasswordView', {
               nombrepagina: "Reestablecer Contraseña",
               body: req.body,
               error
          })
     }
    
     try{
          const user = await User.findOne({where: {token: req.params.token, expiracion: {[Op.gte]: Date.now()}}})
          if(!user){
               req.flash('error', 'Usuario Inválido o Tiempo de Cambio de Password Sobrepasado');
               res.redirect('/reestablecer');
          }
          if(req.body.password_nuevo !== req.body.confirm){
               return res.render('restablecerPasswordView', {
                    nombrepagina: "Reestablecer Contraseña",
                    body: req.body,
                    error: "La confirmación del password no coincide"
               })
          }
          user.token = null;
          user.expiracion = null;
          user.password = bcrypt.hashSync(req.body.password_nuevo, 10);
          await user.save();
          req.flash("success", "Tu password se ha modificado correctamente");
          return res.redirect('/signin');

     }catch(err){
          console.log(err.message);
          return res.render('restablecerPasswordView', {
               nombrepagina: "Reestablecer Contraseña",
               body: req.body,
               error: "Hubo un error"
          })
     }
}

