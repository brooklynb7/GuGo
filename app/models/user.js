'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment'),
	path = require('path'),
	config = require(path.resolve('./config/config')),
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length >= 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	name: {
		type: String,
		trim: true,
		default: ''
	},
	email: {
		type: String,
		trim: true,
		default: '',
		match: [/.+\@.+\..+/, '请填写正确的邮箱地址']
	},
	username: {
		type: String,
		unique: true,
		required: '请填写用户名',
		trim: true
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, '密码长度至少6位']
	},
	salt: {
		type: String
	},
	mobile: {
		type: String,
		default: '',
		trim: true
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {

	},
	additionalProvidersData: {

	},
	role: {
		type: String,
		default: config.roles.user
	},
	grade: {
		type: Number,
		default: 0
	},
	score: {
		type: Number,
		default: 0
	},
	rate: {
		type: Number,
		default: 0
	},
	updated: {
		type: Date
	},
	updatedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	},
	status: {
		//10:申请厂家中, 11: 申请厂家成功, 12: 申请厂家被拒
		type: Number,
		default: config.userStatus.init
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	},
	relatedUser: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length >= 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

UserSchema.plugin(autoIncrement.plugin, {
	model: 'User',
	field: 'userId',
	startAt: 1000,
	incrementBy: 1
});

mongoose.model('User', UserSchema);

var UserLoginSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	ip: {
		type: String,
		default: ''
	},
	address: {
		type: String,
		default: ''
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('UserLogin', UserLoginSchema);
