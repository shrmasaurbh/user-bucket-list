const winston = require('winston')
const Sequelize =require('sequelize')
const db ={}

var sequelize = new Sequelize(CONFIG.mysqldb_name, CONFIG.mysqldb_user, CONFIG.mysqldb_password, {
  host: CONFIG.mysqldb_host,
  dialect: CONFIG.mysqldb_dialect,
  operatorAliases: false,
  freezeTableName: true,
  // underscored: true,
  timezone: '+05:30' //for writing to database
})

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.roles = require('../api/models/RoleModel')(sequelize,Sequelize);

db.users = require("../api/models/UserModel")(sequelize,Sequelize);
db.wish_list = require("../api/models/UserWishModal")(sequelize,Sequelize);
db.cart = require("../api/models/UserCartModal")(sequelize,Sequelize);
db.login_history = require("../api/models/LoginHistoryModel")(sequelize,Sequelize);
db.address = require("../api/models/AddressModel")(sequelize,Sequelize);


db.users.hasOne(db.roles , {foreignKey: 'role_id',sourceKey: 'role_id'});
db.users.hasMany(db.address , { as:'addresses', foreignKey : 'user_id'});
db.users.hasMany(db.login_history , { as:'history', foreignKey : 'user_id'});
db.users.hasMany(db.wish_list , { as:'wishes', foreignKey : 'user_id'});
db.users.hasOne(db.cart , { as:'cart', foreignKey : 'user_id'});

module.exports = db;