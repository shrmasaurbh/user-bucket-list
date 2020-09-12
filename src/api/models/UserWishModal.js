const Sequelize =require('sequelize')
const db = require('../../config/connections');

module.exports = function(sequelize, DataTypes){
	var wishlist = sequelize.define('wish_list', {
		wish_id: {
		type: DataTypes.INTEGER,
		primaryKey:true,
		autoIncrement:true,
		allowNull: false,

		},

		user_id : DataTypes.INTEGER,
		product_id : DataTypes.INTEGER,
	},{
	  // don't add the timestamp attributes (updatedAt, createdAt)
		timestamps: false,
		freezeTableName: true,
  		tableName: 'wish_list'

	})
	return wishlist;
};