const { BAD_REQUEST, SUCCESS_STATUS } = require('../../../helper/statusCode');
const AUTH_MODEL = require('../auth.model/authModel')
const bcrypt = require("bcrypt")
require("dotenv").config(); 

const auth = {};

auth.signup = async (req,res) =>{
    try{
        let data = req.body
        console.log("data",data)

        if(!(data.email && data.password)){
            res.status(BAD_REQUEST).send({
                success : false,
                message : "Email or password not found"
            })
        }
        else{
             const hash = await bcrypt.hash(data.password,process.env.SALT_ROUND);
            data.password =hash
            let saveUserDetails = await AUTH_MODEL.save(data)
            if(saveUserDetails){
                res.status(SUCCESS_STATUS).send({
                    success:true,
                    message:"User signup successfully",
                    data: saveUserDetails
                })
            }
            else{
                res.status(BAD_REQUEST).send({
                    success:false,
                    message:"Something went wrong! please try again"
                })
            }
        }
       
    }
    catch(err){
console.log(err)
    }

}

auth.login = async(req,res) =>{
    try{
        let data = req.body
        let existingUser = await AUTH_MODEL.find({email:data.email})
        if(!existingUser){
            res.status(BAD_REQUEST).send({
                success:false,
                message:"User not found"
            })

        }
        else{
            // compare password
            const result = await bcrypt.compare(data.password, existingUser.password);
            if(result){
                
    // Create token
    const token = jwt.sign(
        { id: user._id },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      existingUser.token = token;
let saveLoginDetails = await AUTH_MODEL.findOneAndUpdate()
if(saveLoginDetails){
    res.status(SUCCESS_STATUS).send({
        success:true,
        message:"user login successfully"
    })
}
else{
    res.status(BAD_REQUEST).send({
        success:false,
        message:"Login failed"
    })
}


            }
            else{
                res.status(BAD_REQUEST).send({
                    success:false,
                    message:"Password not match"
                })
            }
        }

    }
    catch(err){
        console.log("err",err)
        res.status(BAD_REQUEST).send({
            message:err.message
        })

    }
}

module.exports = auth