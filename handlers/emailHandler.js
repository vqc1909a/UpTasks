const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');
const {google} = require('googleapis');

//!Nos va a permitir agregar estilos lineales
const juice = require('juice');    
//!Nos va crear una version de nuestro correo de html a puro texto
const { htmlToText } = require("html-to-text");

// const mailtrapconfig = require('../config/mailtrap');

//!Crear mi cuenta de oAuth2Cliente de Gmail 

const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI) 
oAuth2Client.setCredentials({refresh_token: process.env.GOOGLE_REFRESH_TOKEN})

//!Configuracion con mailtrap
// let transporter = nodemailer.createTransport({
//     name: "cualquiernombre"
//     host: mailtrapconfig.host,
//     port: mailtrapconfig.port,
//     auth: {
//       user: mailtrapconfig.user, 
//       pass: mailtrapconfig.pass, 
//     },
// });





const generarHtml = (archivo, opciones) => {
     const html = pug.renderFile(path.join(__dirname, `../views/emails/${archivo}.pug`), opciones);
     return juice(html);
}

const enviarEmail = async ({correo, asunto, archivo, url}) => {

     //!configuracion con API GMAIL
     const accessToken = await oAuth2Client.getAccessToken();
     const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
          type: 'OAuth2',
          user: 'vqc1909a@gmail.com',
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          accessToken: accessToken         
          }
     })
     const html = generarHtml(archivo, url);
     try{
          let info = await transporter.sendMail({
               to: correo, // list of receivers
               from: 'VQC1909A 😷 <vqc1909a@gmail.com>', /* 'UpTask <no-reply@uptask.com>' */ // sender address
               //!Asunto del mensaje
               subject: asunto, // Subject line
               //!Version texto plano del mensaje
               text: htmlToText(html), // plain text body
               //!Version html mensaje
               html // html body
          });
          console.log("Message sent: %s", info);
          console.log("Message sent: %s", info.messageId);
     }catch(err){
          console.log(err.message)
     }
}
module.exports = enviarEmail;