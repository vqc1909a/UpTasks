
exports.redirectContent = (req, res, next) => {
     if(req.isAuthenticated()){
          return next();
     }
     return res.redirect('/signin');    
}

exports.redirectSignin = (req, res, next) => {
     if (req.isAuthenticated()) {
          return res.redirect("/");
     }
     return next();
}