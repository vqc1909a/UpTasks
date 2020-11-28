const path = require('path');
module.exports = {
     entry: path.join(__dirname, "./public/js"),
     output: {
          filename: "bundle.js",
          path: path.join(__dirname, "./public/dist")
     },
     //! Webpack requiere ciertos modulos para que utilizem , asi que le especificamos que modulos queremos utilizar
     module: {
          rules: [
               {
                    //! Especificar que tipo de archivos va a procesar
                    test: /\.m?js$/,
                    use: {
                         //!Especificar que plugin va a utilizar
                         loader: "babel-loader",
                         options: {
                              presets: ['@babel/preset-env']
                         }
                    }

               },
               {
                    //sass
               },
               {
                    //images
               }
          ]

     }
}