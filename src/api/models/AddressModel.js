const Sequelize =require('sequelize')
const db = require('../../config/connections');

module.exports = function(sequelize, DataTypes){
	var address = sequelize.define('address', {
		address_id: {
		type: DataTypes.INTEGER,
		primaryKey:true,
		autoIncrement:true,
		allowNull: false,
		// field: 'user_id',
	},	

	user_id: DataTypes.INTEGER,
	first_name: DataTypes.STRING,
	last_name: DataTypes.STRING,
	address1: DataTypes.STRING,
	address2: DataTypes.STRING,
	country: DataTypes.STRING,
	state: DataTypes.STRING,
	city: DataTypes.STRING,
	street: DataTypes.STRING,
	apartment: DataTypes.STRING,
	phone_number: DataTypes.STRING,
	postal_code: DataTypes.INTEGER,
	is_primary: DataTypes.BOOLEAN,

	},{
	  // don't add the timestamp attributes (updatedAt, createdAt)
		timestamps: false,
		underscored: true,
		freezeTableName: true,
  		tableName: 'address'

	  // your other configuration here

	})
	return address;
};