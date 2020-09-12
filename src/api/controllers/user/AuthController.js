const { validationResult } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../../../helpers/apiResponse");

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const apiResp = require(BASEPATH+'/src/helpers/apiResponse');
const db = require('../../../config/connections');

module.exports = {

    async userRegister(req, res) {
        try {
            var err = {};
            // Extract the validation errors from a request.
            const errors = validationResult(req);
            if (!errors.isEmpty()) {

                err.message = errors.errors

                return apiResp.apiErr( req, res, 400, err);

                // Display sanitized values/errors messages.
                // return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            } else {

                //hash input password
                const hash = bcrypt.hashSync(req.body.password, 10);
                var user = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        mobile_number: parseInt(req.body.mobile_number),
                        is_active: 1,
                        role_id: req.body.role_id,
                    };
                        // Save user.
                db.users.create(user).then(data => {
                    var meta ={
                        "status": 201,
                        // "error" : false
                    }
                    console.log(data)

                    
                    return apiResp.apiResp( req, res, data, meta =meta );

                })
                .catch(err => {
                    console.log("last",err)
                    return apiResp.apiErr( req, res, 400, err);

                })
            }
        } catch (err) {
            //throw error in json response with status 500.
            console.log(err);
            return apiResp.apiErr( req, res, 400, err);

        }
    },

    async userLogin(req, res) {
        var err = {
            message : ""
        };
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            err.message = errors.errors

            return apiResp.apiErr( req, res, 400, err);

        } else {
            try{

               var user = await db.users.findOne({ where: {mobile_number: req.body.mobile_number},raw:true });
                if (user != null) {
                    //Compare given password with db's hash.
                    bcrypt.compare(req.body.password, user.password, async function(err, match) {
                        var err = {}

                        if (match) {
                              console.log("user",user)
                            //Check account confirmation.
                            if (user.is_active) {
                                // Check User's account active or not.
                                    let userData = {
                                        id: user.user_id,
                                        member_id: user.member_id,
                                        name: user.name,
                                        email: user.email,
                                        email_verified: user.email_verified,

                                    };
                                    
                                    //Prepare JWT token for authentication
                                    const jwtPayload = userData;
                                    const jwtData = {
                                        expiresIn: CONFIG.jwt_expiration,
                                    };
                                    console.log(CONFIG)
                                    //Generated JWT token with Payload and secret.
                                    userData.jwtData = jwtData;
                                    userData.token = jwt.sign(jwtPayload, CONFIG.jwt_encryption, jwtData);
                                    // let ip_info = JSON.stringify(req.ipInfo)

                                    let agent_details ={};
                                    for(let agent of CONSTANT.USER_AGENT_KEYS){
                                        agent_details[agent] = req.useragent[agent]; 

                                    }
                                    let login_info = {
                                        user_id : user.user_id,
                                        ip_info : req.ipInfo,
                                        agent_details : agent_details
                                    }
                                    // console.log(ip_info)
                                    // console.log(agent_details)
                                    await db.login_history.create(login_info)

                                    var meta ={
                                        "status": 200,
                                        // "error" : false
                                    }  
                                    return apiResp.apiResp( req, res, userData, meta );
                            } else {
                                err.message = "User is not active";
                                return apiResp.apiErr( req, res, 400, err);
                            }
                        } else {
                            
                            err.message = "Incorrect Password";
                            return apiResp.apiErr( req, res, 400, err);
                        }
                    });
                } else {
                    err.message = "User is not found";
                    return apiResp.apiErr( req, res, 400,err);
                }
            
            }
            catch (err) {
                return apiResp.apiErr( req, res, 400,err);
            }
        }
    },

    async forgotPassword(req, res) {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            var err ={
                message : errors.errors
            }

            return apiResp.apiErr( req, res, 400, err);
        } else {
            var meta ={
                        "status": 200,
                        message : "Phone number is found"
                        // "error" : false
                    }
            return apiResp.apiResp( req, res, [], meta =meta );
        }
    },

    async changePassword(req, res) {
            
        var err = {};
        var meta ={
                    "status": 200,
                    // "error" : false
                }
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            err.message = errors.errors

            return apiResp.apiErr( req, res, 400, err);
        } else {

            //hash input password
            const hash = bcrypt.hashSync(req.body.password, 10)

            try {

                user = await db.users.update(
                                            { password: hash },
                                            { where: { mobile_number: req.body.mobile_number } }
                                        );

                if(user[0]){
                    return apiResp.apiResp( req, res, [], meta =meta );

                }else{
                    meta.status = 400;
                    meta.message = "Password is not Changed";
                    return apiResp.apiResp( req, res, [], meta =meta );

                }
            }
            catch (err) {
                return apiResp.apiErr( req, res, 400, err);
            }



                
        }
    },
    async updatePassword(req, res) {
            
        var err = {};
        var meta ={
                    "status": 200,
                    // "error" : false
                }
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            err.message = errors.errors

            return apiResp.apiErr( req, res, 400, err);

        } else {
            logged_user = req.requester;

            try{

               var user = await db.users.findOne({where: {user_id: logged_user.id} })
                if (user != null) {
                    user = user.dataValues
                    if(user.is_active){
                        //Compare given password with db's hash.
                    bcrypt.compare(req.body.currentpassword, user.password, async function(err, match) {
                        var err = {}

                        if (match) {
                                const hash = bcrypt.hashSync(req.body.password, 10);
                                user = await db.users.update(
                                            { password: hash },
                                            { where: { user_id: logged_user.id } }
                                        )

                                if(user[0]){
                                    return apiResp.apiResp( req, res, [], meta =meta );

                                }else{
                                    err.message = "Password is not Changed";
                                    return apiResp.apiErr( req, res, 400, err);

                                }

                                // return apiResp.apiResp( req, res, userData, meta );
                            
                        } else {
                            
                            err.message = "Incorrect Password";
                            return apiResp.apiErr( req, res, 400, err);
                        }
                    });

                    }else{
                        err.message = "User is not active";
                        return apiResp.apiErr( req, res, 400,err);
                    }
                    
                } else {
                    err.message = "User is not found";
                    return apiResp.apiErr( req, res, 400,err);
                }
            
            }
            catch (err) {
                console.log("ddddddddd")
                return apiResp.apiErr( req, res, 400,err);
            }



                
        }
    },
}

