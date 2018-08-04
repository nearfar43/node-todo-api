const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const lodash = require('lodash');
const bcrypt = require('bcryptjs');
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

//log out user
userSchema.methods.removeToken = function (token) {
	var user = this;
	return user.update({
		$pull: {
			tokens: {
				token: token
			}
		}
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

//method when user login 
userSchema.statics.findByCredentials = function(email, password) {
	var User = this;

	return User.findOne({email}).then((user) => {
		if (!user) {
			return Promise.reject();
		}
		//create promise object
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
	});
};

//encrypt user password before saving into mongoDB
userSchema.pre('save', function(next) {
	var user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});



var User = mongoose.model('User', userSchema);

module.exports = {User: User};