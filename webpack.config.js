const path = require('path');
module.exports = {
     entry: path.join(__dirname, "./public/js"),
     output: {
          filename: "bundle.js",
          path: path.join(__dirname, "./public/dist")
     },
     //! Webpack requiere ciertos modulos para que utilize
     module: {
          rules: [
               {
                    test: /\.m?js$/,
                    use: {
                         loader: "babel-loader",
                         options: {
                              presets: ['@babel/preset-env']
                         }
                    }

               }
          ]

     }
}