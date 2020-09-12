const Sequelize =require('sequelize')
const db = require('../../config/connections');
 
module.exports = function(sequelize, DataTypes){
	var users = sequelize.define('users', {
		user_id: {
		type: DataTypes.INTEGER,
		primaryKey:true,
		autoIncrement:true,
		allowNull: false,
		// field: 'user_id',
	},	

	name : {
		type: DataTypes.STRING
	},
	
	email : {
		type: DataTypes.STRING,
		allowNull: false,
		validate: { isEmail: {msg: "Email number invalid."} }
	},
	
	mobile_number : {
		type: DataTypes.INTEGER,
		allowNull: false,
		unique: true, 
		validate : {
			len: {args: [7, 11], msg: "Phone number invalid, too short."}, 
			isNumeric: { msg: "not a valid phone number."} }
	},
	
	password : {
		type: DataTypes.STRING,
		allowNull: false,
	},
	
	role_id : DataTypes.INTEGER,
	
	city : DataTypes.STRING,
	
	is_active : DataTypes.BOOLEAN,

	email_verified : DataTypes.BOOLEAN,
	
	phone_verified : DataTypes.BOOLEAN,
	
	createdAt: {
		 // field: 'created_at',
		 type: DataTypes.DATE,
	 },
	 updatedAt: {
		 // field: 'updated_at',
		 type: DataTypes.DATE,
        // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
		 
	 }
	},{
	  // don't add the timestamp attributes (updatedAt, createdAt)
		freezeTableName: true,
  		tableName: 'users'

	  // your other configuration here

	})
	return users;
};