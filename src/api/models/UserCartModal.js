const Sequelize =require('sequelize')
const db = require('../../config/connections');

module.exports = function(sequelize, DataTypes){
  var cart = sequelize.define('cart', {
    cart_id: {
    type: DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    allowNull: false,

    },

    user_id : DataTypes.INTEGER,
    address_id : DataTypes.INTEGER,
    total_price : DataTypes.INTEGER,
    items: { 
            type: DataTypes.STRING, 
            get: function() {
              if(this.getDataValue('items') != null){
                  return JSON.parse(this.getDataValue('items'));
              }else{
                return null;
              }
            }, 
            set: function(val) {
                return this.setDataValue('items', JSON.stringify(val));
            }
        },
  },{
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    freezeTableName: true,
      tableName: 'cart'

  })
  return cart;
};