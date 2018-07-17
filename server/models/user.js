var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//create a schema for a collection
var userSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: [true, 'User email required'],
		trim: true,
		validate: {
			validator: function(v) {
				//regex validator 
				return /[\w-]+@([\w-]+\.)+[\w-]+/.test(v);
			},
			message: '{VALUE} is not a valid email address!'
		}
	}

});

var User2 = mongoose.model('User2', userSchema);

module.exports = {User2: User2};