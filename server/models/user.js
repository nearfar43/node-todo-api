const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const lodash = require('lodash');
var Schema = mongoose.Schema;

//create a schema for a collection
var userSchema = new Schema({
	email: {
		type: String,
		required: [true, 'User email required'],
		trim: true,
		unique: true,
		validate: {
			validator: function(v) {
				//regex validator 
				//return /[\w-]+@([\w-]+\.)+[\w-]+/.test(v);
				return validator.isEmail(v);
			},
			message: '{VALUE} is not a valid email address!'
		}
	},
	password: {
		type: String,
		required: [true, 'password is required'],
		minlength: 6

	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]

});

//override json return object
userSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();

	return lodash.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth'; 
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	user.tokens = user.tokens.concat({access, token});

	return user.save().then(() => {
		return token;
	});
};


//model method

userSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, 'abc123');
	} catch (e) {
		return new Promise((resolve, reject) => {
			reject();	
		});
	}


	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

var User = mongoose.model('User', userSchema);

module.exports = {User: User};