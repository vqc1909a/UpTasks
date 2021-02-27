const nodemailer = require('nodemailer');
const sgTransport = require("nodemailer-sendgrid-transport");
// const sgMail = require("@sendgrid/mail");
const pug = require('pug');

//!Nos va a permitir agregar estilos lineales
const juice = require('juice');    

//!Nos va crear una version de nuestro correo de html a puro texto
const { htmlToText } = require("html-to-text");

const mailtrapconfig = require('../config/mailtrap');

const path = require('path');

// let transporter = nodemailer.createTransport(sgTransport({
//      auth: {
//         api_key: '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'
//     }
// }))

// sgMail.setApiKey("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");

let transporter = nodemailer.createTransport({
    host: mailtrapconfig.host,
    port: mailtrapconfig.port,
    auth: {
      user: mailtrapconfig.user, 
      pass: mailtrapconfig.pass, 
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
               to: correo, // list of receivers
               from: 'vqc1909a@gmail.com', /* 'UpTask <no-reply@uptask.com>' */ // sender address
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