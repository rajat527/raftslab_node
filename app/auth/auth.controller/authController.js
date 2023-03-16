/*
Author (Rajat chauhan)

emailId : rajatchauhan527@gmail.com

*/

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
        res.send({
            message: err.message
        })
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
                // send detail of user in token
                tokenPayload = {
                    userId: existingUser._id,
                    role: existingUser.role,
                    email: existingUser.email

                }
                // Create token
                const jwtToken = jwt.sign(
                    tokenPayload,
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



/**
 * EDIT USER
 * @param {id} req.params
 * @param {*} req.body 
 */
auth.editUser = async (req, res) => {
    try {
        // only Admin (role:1) have permission to edit user detials
        if (req.role == 0) {
            data = req.body
            let existingUserDetail = await AUTH_MODEL.findOne({ _id: req.params.id })
            if (existingUserDetail) {
                let updateUserDetails = await AUTH_MODEL.findOneAndUpdate({ _id: req.params.id }, data)
                if (updateUserDetails) {
                    let UserDetail = await AUTH_MODEL.findOne({ _id: req.params.id })
                    res.status(SUCCESS_STATUS).send({
                        success: true,
                        message: 'User edit successfully',
                        data: UserDetail
                    })
                }
                else {
                    res.status(BAD_REQUEST).send({
                        success: false,
                        message: 'Something went wrong'
                    })
                }

            }
            else {
                res.status(BAD_REQUEST).send({
                    success: false,
                    message: 'User not found'
                })
            }
        }
        else {
            res.status(BAD_REQUEST).send({
                success: false,
                message: 'Only admin have permission to edit user details'
            })
        }

    }
    catch (error) {
        console.log(error)
        res.status(BAD_REQUEST).send({
            success: false,
            message: error.message
        })
    }
}

/**
 * GET ALL USER LIST
 * @param {page} req.query 
 * @param {limit} req.query 
 */

auth.getAllUserList = async (req, res) => {
    try {
        const pageOptions = {
            page: parseInt(req.query.page, 10) || 0,
            limit: parseInt(req.query.limit, 10) || 10
        }
        let userList = await AUTH_MODEL.find()
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit)
        if (userList) {
            res.status(SUCCESS_STATUS).send({
                success: true,
                message: 'User list found successfully',
                data: userList
            })
        }
        else {
            res.status(BAD_REQUEST).send({
                success: false,
                message: 'User list not found'
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(BAD_REQUEST).send({
            success: false,
            message: error.message
        })
    }
}

/**
 * GET USER SINGKE DETAIL
 * @param {id} req.params 
 *  
 */
auth.getSingleUserDetail = async (req, res) => {
    try {
        let userDetail = await AUTH_MODEL.findById({ _id: req.params.id })
        if (userDetail) {
            res.status(SUCCESS_STATUS).send({
                success: true,
                message: 'User found successfully',
                data: userDetail
            })
        }
        else {
            res.status(BAD_REQUEST).send({
                success: false,
                message: 'User not found'
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(BAD_REQUEST).send({
            success: false,
            message: error.message
        })
    }
}


/**
 * SOFT DELETE USER (CHANGE USER STATE TO DELETE)
 * @param {id} req.params 
 *  
 */
auth.updateUserState = async (req, res) => {
    try {
        let existingUserDetail = await AUTH_MODEL.findOne({ _id: req.params.id })
        if (existingUserDetail) {
            let updateUserStatus = await AUTH_MODEL.findOneAndUpdate({ _id: req.params.id }, { stateId: 3 })
            if (updateUserStatus) {
                let detail = await AUTH_MODEL.findOne({ _id: req.params.id })
                res.status(SUCCESS_STATUS).send({
                    success: true,
                    message: 'User status is changed successfully',
                    data: detail
                })
            }
            else {
                res.status(BAD_REQUEST).send({
                    success: false,
                    message: 'Something went wrong'
                })
            }

        }
        else {
            res.status(BAD_REQUEST).send({
                success: false,
                message: 'User not found'
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(BAD_REQUEST).send({
            success: false,
            message: error.message
        })
    }
}


/**
 *  DELETE PERMENANT USER FROM DATABASE
 * @param {id} req.params 
 *  
 */
auth.deleteUser = async (req, res) => {
    try {

        // only admin can delete
        if (req.role == 1) {


            let deleteUser = await AUTH_MODEL.findOneAndDelete({ _id: req.params.id })
            if (deleteUser) {
                res.status(BAD_REQUEST).send({
                    success: false,
                    message: 'User delete Successfully',
                    data: deleteUser
                })
            }
            else {
                res.status(BAD_REQUEST).send({
                    success: false,
                    message: 'Something went wrong'
                })
            }
        }
        else {
            res.status(BAD_REQUEST).send({
                success: false,
                message: 'Permission denied only admin have permission to delete the user'
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(BAD_REQUEST).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = auth