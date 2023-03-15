const { BAD_REQUEST, SUCCESS_STATUS } = require('../../../helper/statusCode');
const AUTH_MODEL = require('../auth.model/authModel')
const bcrypt = require("bcrypt")
const process = require('process')
require("dotenv").config();
const jwt = require('jsonwebtoken')

const auth = {};

auth.signup = async (req, res) => {
    try {
        let data = req.body
        console.log("data", data)
        let existingUserDetail = await AUTH_MODEL.findOne({ email: data.email })
        if (existingUserDetail) {
            res.status(BAD_REQUEST).send({
                success: false,
                message: "Email already exist"
            })
        }
        if (!(data.email && data.password)) {
            res.status(BAD_REQUEST).send({
                success: false,
                message: "Email or password not found"
            })
        }

        else {
            // bcrypt password
            const hash = await bcrypt.hash(data.password, 10);
            // save hash password
            data.password = hash
            let saveUserDetails = await AUTH_MODEL.create(data)
            if (saveUserDetails) {
                res.status(SUCCESS_STATUS).send({
                    success: true,
                    message: "User signup successfully",
                    data: saveUserDetails
                })
            }
            else {
                res.status(BAD_REQUEST).send({
                    success: false,
                    message: "Something went wrong! please try again"
                })
            }
        }

    }
    catch (err) {
        console.log(err)
    }

}

auth.login = async (req, res) => {
    try {
        let data = req.body
        let existingUser = await AUTH_MODEL.findOne({ email: data.email })
        if (!existingUser) {
            res.status(BAD_REQUEST).send({
                success: false,
                message: "User not found"
            })

        }
        else {

            // compare password
            const result = await bcrypt.compare(data.password, existingUser.password);
            if (result) {

                // Create token
                const jwtToken = jwt.sign(
                    { id: existingUser._id },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );
                // save user token

                let saveTokenInUseCredential = await AUTH_MODEL.findOneAndUpdate({ email: data.email }, { token: jwtToken })
                if (saveTokenInUseCredential) {
                    res.status(SUCCESS_STATUS).send({
                        success: true,
                        message: "user login successfully",
                        data: saveTokenInUseCredential
                    })
                }
                else {
                    res.status(BAD_REQUEST).send({
                        success: false,
                        message: "Login failed"
                    })
                }


            }
            else {
                res.status(BAD_REQUEST).send({
                    success: false,
                    message: "Password not match"
                })
            }
        }

    }
    catch (err) {
        console.log("err", err)
        res.status(BAD_REQUEST).send({
            message: err.message
        })

    }
}

module.exports = auth