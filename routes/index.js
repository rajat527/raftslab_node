var express = require('express');
var router = express.Router();
var app = require('express');
const AUTH_CONTROLLER = require('../app/auth/auth.controller/authController')

require('express-group-routes');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post("/signup", AUTH_CONTROLLER.signup); // /api/v1/login 
router.post("/login",AUTH_CONTROLLER.login)



module.exports = router;
