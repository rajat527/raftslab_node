/*
Author (Rajat chauhan)

emailId : rajatchauhan527@gmail.com

*/

const validator = require('../helper/validate');

const _validation = {};
_validation.signupValidation = async (req, res, next) => {
    const validationRule = {
        "email": "required|string|email",
        "username": "required|string",
        "phone": "required|string",
        "password": "required",
        
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
}

_validation.loginValidation = async (req, res, next) => {
    const validationRule = {
        "email": "required|string|email",
        "username": "required|string",
        "password": "required",
        
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
}
module.exports = _validation