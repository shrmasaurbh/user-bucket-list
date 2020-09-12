require('dotenv').config();

let CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'development';
CONFIG.port         = process.env.PORT  || '4000';
CONFIG.client_url         = process.env.CLIENT_URL  || "http://localhost:3000";

CONFIG.mysqldb_dialect   = process.env.MYSQLDB_DIALECT    || 'mysql';
CONFIG.mysqldb_host      = process.env.MYSQLDB_HOST       || 'localhost';
CONFIG.mysqldb_port      = process.env.MYSQLDB_PORT       || '3306';
CONFIG.mysqldb_name      = process.env.MYSQLDB_NAME       || 'homesfy';
CONFIG.mysqldb_user      = process.env.MYSQLDB_USER       || 'root';
CONFIG.mysqldb_password  = process.env.MYSQLDB_PASSWORD   || 'root123';

CONFIG.jwt_encryption 	 = process.env.JWT_ENCRYPTION || 'AaBrAkaDaBaRa';
CONFIG.jwt_expiration 	 = process.env.JWT_EXPIRATION || '3h';

module.exports = CONFIG;
