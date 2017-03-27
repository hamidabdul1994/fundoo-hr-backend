/*
 * User Bank Schema
 * @path models/userBankSchema.js
 * @file userBankSchema.js
 */
'use strict';

/*
 * Module dependencies
 */
var mongoose = require('mongoose'),
    User = require('./userSchema'),
    Base = require('./base');  // Include the base schema

var ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * @schema  UserBankDetailsSchema
 * @description User Bank details of user
 */
var UserBankDetailsSchema = new Base.BaseSchema({
	user: {
		type: ObjectId,
	    ref: 'User',
		unique: true,
		required: true
	},
	accountNumber: {
		type: String,
		trim: true,
		required: true
	},
	bankName: {
		type: String,
		trim: true,
		required: true
	},
	ifscCode: {
		type: String,
		trim: true
	},
	panNumber: {
		type: String,
		trim: true
	},
	isSalaried: {
		type: Boolean,
		trim: true
	},
	reason: {
		type: String,
		trim: true
	}
});

/**
 * Expose `UserBankDetails` Model
 */
module.exports = mongoose.model('UserBankDetails', UserBankDetailsSchema);
