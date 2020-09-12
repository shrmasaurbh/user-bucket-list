// const UserDB = require("../../models/UserModel");
// const { validationResult } = require("express-validator");
const apiResp = require(BASEPATH+'/src/helpers/apiResponse');
const db = require('../../../config/connections');
const Sequelize =require('sequelize');
const UserDAL = require('../../DAL/Users');
var moment = require('moment');

module.exports = {
    
    async getUserListing(req, res) {

                
        var err = {
                    "message": ""
                };
        var meta ={
                    "status": 200,
                    // "error" : false
                }
        var postData = req.body;  
        var filters = {}

        if (typeof postData.pageId === 'undefined' || postData.pageId === null) {
            pageId = 1;
        } else {
            pageId = postData.pageId;
        }
        if (typeof postData.size === 'undefined' || postData.size === null) {
            size = 16;
        } else {
            size = postData.size;
        }

        fromData = (pageId - 1) * size
        // urlObj.query = postData.query;
        // urlObj.filters = null;

        meta.count = 0;
        
        if(postData.filters){
            filters = postData.filters;
        }
        try{
            const { count, rows: users } = await UserDAL.getUserListing(filters, fromData, size, pageId);

            if(count){
                meta.count = count;
                meta.pageId = pageId;
                meta.from = fromData;
                meta.size = size;
                meta.total_page = Math.ceil(meta.count / size);
                
                return apiResp.apiResp( req, res, users, meta );
            
            }else{
                meta.message = "DATA not found";
                return apiResp.apiErr( req, res, 400, meta);
            }

        }catch (err) {
            return apiResp.apiErr( req, res, 400, err);  
        }
    },

  
    async userDetails(req, res) {
     
        var err = {
                    "message": ""
                };
        var meta ={
                    "status": 200,
                    // "error" : false
                }
        try{
                        // console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            var include = [ 
                            {
                              model: db.address,
                              as: "addresses",
                            },
                            {
                              model: db.roles,
                              // as: "role",
                              // attributes: ['user_id','name']
                            },
                        ];
            await db.users.findOne({ attributes: {
                                                    exclude: ['password']
                                                },
                                    where: {user_id: parseInt(req.params.user_id)} ,
                                    include
                                })
                    .then(user_data => {
                        
                        if(user_data){
                            user_data.dataValues.createdAt = user_data.dataValues.createdAt ? moment(user_data.dataValues.createdAt).format('llll') : null;
                            user_data.dataValues.updatedAt = user_data.dataValues.updatedAt? moment(user_data.dataValues.updatedAt).format('llll') : null;
                            return apiResp.apiResp( req, res, user_data, meta );
                                    
                        }
                        err.message = "User not found"
                        // console.log(meta)
                        return apiResp.apiErr( req, res, 400, err);
                        // throw new Error('Invalid object');
                        
                        // console.log(aa)
                        // res.status(200).send(data);
                    })
                    .catch(err => {
                        apiResp.apiErr( req, res, 400, err);
                    })
                    // console.log("user",user)
        } 
        catch (err) {
            apiResp.apiErr( req, res, 400, err);
        }       
    },
    async userUpdate(req, res) {

                
        var err = {
                    "message": ""
                };
        var meta ={
                    "status": 200,
                    // "error" : false
                }
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                err.message = errors.errors
                apiResp.apiErr( req, res, 400, err);
                // Display sanitized values/errors messages.
                // return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            } else {
                await db.users.findOne({  attributes: {
                                                    exclude: ['password']
                                                },
                                        where: {user_id: parseInt(req.params.user_id)} 
                                    })
                    .then(async user => {
                        if(user){
                            
                            user.set('updatedAt', new Date());
                            let data = await user.update(req.body);

                            return apiResp.apiResp( req, res, data, meta );

                        }else{
                            err.message = "User not found"
                            // console.log(meta)
                            return apiResp.apiErr( req, res, 400, err);
                        }
                        // throw new Error('Invalid object');
                        
                        // console.log(aa)
                        // res.status(200).send(data);
                    })
                    
                    .catch(err => {
                        apiResp.apiErr( req, res, 400, err);
                    })
                    // console.log("user",user)
            }
        } 
        catch (err) {
            apiResp.apiErr( req, res, 400, err);
        }       
    },

    async userDelete(req, res) {

                
        var err = {
                    "message": ""
                };
        var meta ={
                    "status": 200,
                    // "error" : false
                }
        try{

            await db.users.findOne({ where: {user_id: parseInt(req.params.user_id)} })
                    .then(async user_data => {

                        if(user_data){
                            user_data.is_active =  0
                            user_data.set('updatedAt', new Date());
                            let user_data_update = await user_data.save();

                            return apiResp.apiResp( req, res, [], meta );

                        }else{

                        err.message = "User not found"
                        return apiResp.apiErr( req, res, 400, err);
                        }
                    })
                    .catch(err => {

                    console.log("user",err)
                        return apiResp.apiErr( req, res, 400, err);
                    })
        } 
        catch (err) {
            return apiResp.apiErr( req, res, 400, err);
        }       
    },

    async userListAutocomplete(req, res) {

                
        var err = {
                    "message": ""
                };
        var meta ={
                    "status": 200,
                    // "error" : false
                }

        const Op = Sequelize.Op;

        if (typeof req.query.q !== 'undefined' || req.query.q !== null) {
            var queryStr = req.query.q;
            var role = req.params.role;

            try{
                
                await db.users.findAll({ 
                                        include: [
                                                    {
                                                      model: db.roles,
                                                      as: "role",
                                                      where :{name: role},
                                                      attributes:{exclude:['role_id', 'role']}
                                                    }],
                                        where: {name:{ [Op.like]: '%'+queryStr+'%' },  "is_active":1 },
                                        attributes: ['user_id','name']

                                    })
                        .then(user_data => {
                            console.log(user_data)
                            if(user_data){
                                return apiResp.apiResp( req, res, user_data, meta );
                                        
                            }
                            err.message = "user not found"
                            // // console.log(meta)
                            return apiResp.apiErr( req, res, 400, err);
                            // throw new Error('Invalid object');
                            
                            // console.log(aa)
                            // res.status(200).send(data);
                        })
                        .catch(err => {
                            apiResp.apiErr( req, res, 400, err);
                        })
                        // console.log("user",project)
            } 
            catch (err) {
                apiResp.apiErr( req, res, 400, err);
            } 
        }      
    },
    
    async addAddess(req, res) {
        var err = {
                    "message": ""
                };
        var meta ={
                    "status": 200,
                    // "error" : false
                }
        try{
                req.body.user_id = req.requester.id;
                let address = await db.address.create(req.body);
                return apiResp.apiResp( req, res, [], meta =meta );
        } 
        catch (err) {
            return apiResp.apiErr( req, res, 300, err);
        }       
    },
   
    async getAddess(req, res) {
        var err = {
                    "message": ""
                };
        var meta ={
                    "status": 200,
                    // "error" : false
                }
        try{
                // req.body.user_id = req.requester.id;
                let address = await db.address.findAll({where: {user_id: req.requester.id}});
                return apiResp.apiResp( req, res, address, meta =meta );
        } 
        catch (err) {
            return apiResp.apiErr( req, res, 300, err);
        }       
    },
    
    async addWish(req, res) {
        var err = {
                    "message": ""
                };
        var meta ={
                    "status": 200,
                    // "error" : false
                }
        try{
                req.body.user_id = req.requester.id;
                let wish_list = await db.wish_list.create(req.body);
                return apiResp.apiResp( req, res, [], meta =meta );
        } 
        catch (err) {
            return apiResp.apiErr( req, res, 300, err);
        }       
    },
   
    async getWish(req, res) {
        var err = {
                    "message": ""
                };
        var meta ={
                    "status": 200,
                    // "error" : false
                }
        try{
                // req.body.user_id = req.requester.id;
                let wish_list = await db.wish_list.findAll({where: {user_id: req.requester.id}});
                return apiResp.apiResp( req, res, wish_list, meta =meta );
        } 
        catch (err) {
            return apiResp.apiErr( req, res, 300, err);
        }       
    },
    

}
