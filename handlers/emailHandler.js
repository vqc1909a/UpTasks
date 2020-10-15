const nodemailer = require('nodemailer');
const pug = require('pug');

//!Nos va a permitir agregar estilos lineales
const juice = require('juice');

//!Nos va crear una version de nuestro correo de html a puro texto
const htmlToText = require("html-to-text");

const emailconfig = require('../config/email');

const path = require('path');

let transporter = nodemailer.createTransport({
    host: emailconfig.host,
    port: emailconfig.port,
    auth: {
      user: emailconfig.user, // generated ethereal user
      pass: emailconfig.pass, // generated ethereal password
    },
});

const generarHtml = (archivo, opciones) => {
     const html = pug.renderFile(path.join(__dirname, `../views/emails/${archivo}.pug`), opciones);
     return juice(html);
}

const enviarEmail = async ({correo, asunto, archivo, url}) => {
     const html = generarHtml(archivo, url);
     
     try{
          let info = await transporter.sendMail({
               from: 'UpTask <no-reply@uptask.com>', // sender address
               to: correo, // list of receivers
               //!Asunto del mensaje
               subject: asunto, // Subject line
               //!Version texto plano del mensaje
               text: htmlToText.fromString(html), // plain text body
               //!Version html mensaje
               html, // html body
          });
          console.log("Message sent: %s", info.messageId);
     }catch(err){
          console.log(err.message)
     }
}
module.exports = enviarEmail;