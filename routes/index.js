var express = require('express');
var router = express.Router();
var app = require('express');
const AUTH_CONTROLLER = require('../app/auth/auth.controller/authController')
const AUTHENTICATION = require('../middleware/auth')

require('express-group-routes');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// routes for user module
router.post("/signup", AUTH_CONTROLLER.signup); 
router.post("/login",AUTH_CONTROLLER.login)
router.put("/edit/:id",AUTHENTICATION,AUTH_CONTROLLER.editUser)
router.get("/getAll",AUTHENTICATION,AUTH_CONTROLLER.getAllUserList)
router.get("/getById/:id",AUTHENTICATION,AUTH_CONTROLLER.getSingleUserDetail)
router.put("/softDelete/:id",AUTHENTICATION,AUTH_CONTROLLER.updateUserState)
router.delete("/delete",AUTHENTICATION,AUTH_CONTROLLER.deleteUser)





module.exports = router;
