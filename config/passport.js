const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy  = require("passport-facebook").Strategy

require('dotenv').config({path: "variables.env"});

const User = require("../models/UserModel");
passport.use(new LocalStrategy(
     //!Tienes que especificar los campos de usuario y contraseña
     {
          usernameField: "email",
          passwordField: "password"
     }, 
     //!Done es como next o un callback que finaliza la ejecución
     async (email, password, done) => {
          try{
               const user = await User.findOne({where: {email}})
               // if(!user){
               //     return done(null, false, {
               //          message: "Cuenta no registrada"
               //     })
               // }
               // //!El usuario existe, pero password incorrecto
               // if(!user.verificarPassword(password)){
               //      return done(null, false, {
               //           message: "Password Incorrecto"
               //      })
               // }
               return done(null, user);
          }catch(err){
               console.log(err);
               return done(null, false, {
                    message: "Ocurrió un error"
               })
          }
     }
))



passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
     // const newUser = {
     //      googleId: profile.id,
     //      //! Nombre Completo
     //      displayName: profile.displayName,
     //      //!Nombres
     //      firstName: profile.name.givenName,
     //      //!Apellidos
     //      lastName: profile.name.familyName,
     //      //!Imagen
     //      image: profile.photos[0].value
     // }
     console.log(profile);
     const newUser = {
          googleId: profile.id,
          name: profile.name.givenName,
          image: profile.photos[0].value
     }
     try{
          const user = await User.findOne({where: {googleId: profile.id}});
          if(user){
               return done(null, user);
          }else{
               const newuser = await User.create(newUser);
               return done(null, newuser);
          }
     }catch(err){
          console.log(err);
          return done(null, false, {
               message: "Ocurrió un error"
          })
     }
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'picture.type(large)', 'email', 'birthday', 'friends', 'first_name', 'last_name', 'middle_name', 'gender', 'link']
  },
  
  async (accessToken, refreshToken, profile, done) => {
          // const newuser = {
          //      facebookId: profile.id,
          //      //! Nombre Completo
          //      displayName: profile.displayName,
          //      //!Nombres
          //      firstName: profile.name.givenName,
          //      //!Apellidos
          //      lastName: profile.name.familyName,
          //      //!Imagen
          //      image: profile.photos[0].value
          // }
          const newUser = {
               facebookId: profile.id,
               name: profile.name.givenName,
               image: profile.photos[0].value
          }
          try{
               const user = await User.findOne({where: {facebookId: profile.id}})
               if(user){
                    return done(null, user);
               }else{
                    const newuser = await User.create(newUser);
                    return done(null, newuser)
               }

          }catch(err){
               console.log(err);
               return done(null, false, {
                    message: "Ocurrió un error"
               })
          }
     }
));

//serializar el usuario (Ponerlo como un objeto)
passport.serializeUser((user, done) => {
     done(null, user);
})     

//deserealizar el usuario (acceder a las propiedades del objeto)
passport.deserializeUser((user, done) => {
     done(null, user);
})

module.exports = passport;

