const Sequelize =require('sequelize')
const db = require('../../config/connections');


module.exports = function(sequelize, DataTypes){
	var login_history = sequelize.define('login_history', {
	login_history_id: {
		type: DataTypes.INTEGER,
		primaryKey:true,
		autoIncrement:true,
		allowNull: false,
        // field: 'user_id',

	},
	user_id : DataTypes.INTEGER,
	
	
	ip_info: { 
		        type: DataTypes.STRING, 
		        get: function() {
	        		if(this.getDataValue('ip_info') != null){
		            	return JSON.parse(this.getDataValue('ip_info'));
		        	}else{
		        		return null;
		        	}
		        }, 
		        set: function(val) {
		            return this.setDataValue('ip_info', JSON.stringify(val));
		        }
		    },
	
	agent_details: { 
		        type: DataTypes.STRING, 
		        get: function() {
	        		if(this.getDataValue('agent_details') != null){
		            	return JSON.parse(this.getDataValue('agent_details'));
		        	}else{
		        		return null;
		        	}
		        }, 
		        set: function(val) {
		            return this.setDataValue('agent_details', JSON.stringify(val));
		        }
		    },

	createdAt: {
		 // field: 'created_at',
		 type: DataTypes.DATE,
	 },

	

},{
  // don't add the timestamp attributes (updatedAt, createdAt)
	timestamps: false,
	freezeTableName: true
  // your other configuration here
})
	return login_history;
};

