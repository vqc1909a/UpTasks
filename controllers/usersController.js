const User = require('../models/UserModel');
// const bcrypt = require('bcrypt');

exports.formsignup = (req, res) => {
      const flash = req.flash();
      let error;
      if (Object.keys(flash).length !== 0) {
           error = flash.error[0];
      }
     return res.render('signupView', {
          nombrepagina: "Signup - UpTasks",
          error
     })
}


exports.formsignin = (req, res) => {
     const flash = req.flash();
     let error;
     let success;
     
     if(flash.error){
          error = flash.error[0];
     }else if(flash.success){
          success = flash.success[0];
     }

     return res.render("signinView", {
       nombrepagina: "Signin - UpTasks",
       success,
       error
     });
}


exports.formrestablecer = (req, res) => {
     const flash = req.flash();
     let error;
     if (Object.keys(flash).length !== 0) {
          error = flash.error[0];
     }
     return res.render('restablecerView', {
          nombrepagina: "Reestablecer Contraseña",
          error
     })
} 

exports.formrestablecerpassword = async (req, res) => {
     try{
          const user = await User.findOne({where: {token: req.params.token}});
          if(!user){
               req.flash('error', 'Acceso denegado')
               return res.redirect('/reestablecer');
          }
          return res.render("restablecerPasswordView", {
               nombrepagina: "Reestablecer Contraseña"
          })
     }catch(err){
          console.log(err.message);
          return res.render("restablecerPasswordView", {
               nombrepagina: "Reestablecer Contraseña",
               error: "Hubo un error"
          })
     }

}
