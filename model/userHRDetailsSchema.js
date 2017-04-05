/*
 * User HR Details Schema
 * @path models/userHRDetailsSchema.js
 * @file userHRDetailsSchema.js
 */
'use strict';

/*
 * Module dependencies
 */
var mongoose = require('mongoose'),
    User = require('./userSchema').User,
	Base = require('./base'); // Include the base schema

var ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * @schema UserHRDetailsSchema
 * @description User HR related Details
 */
var UserHRDetailsSchema = new Base.BaseSchema({
	user: {
		type: ObjectId,
		ref: 'User',
		unique: true,
		required: true
	},
	hiringCity: {
		type: String,
		trim: true
	},
	fellowshipPeriod: {
		type: String,
		trim: true
	},
	bridgelabzStartDate: {
		type: Date,
		trim: true
	},
	companyStartDate: {
		type: Date,
		trim: true
	},
	companyEndDate: {
		type: Date,
		trim: true
	},
	enggContractInitiated: {
		type: Boolean,
		trim: true
	},
	enggContractSigned: {
		type: Boolean,
		trim: true
	},
	companyContractInitiated: {
		type: Boolean,
		trim: true
	},
	companyContractSigned: {
		type: Boolean,
		trim: true
	},
	contractSignDate: {
		type: Date,
		trim: true
	},
	initiateTransfer: {
		type: String,
		trim: true
	}
});

// UserHRDetailsSchema.options.toJSON = {
//     transform: function(doc, ret, options) {
//         ret.id = ret._id;
//         delete ret._id;
//         delete ret.__v;
//         return ret;
//     }
// };
/**
 * Expose `UserHRDetails` Model
 */
module.exports = mongoose.model('UserHRDetails', UserHRDetailsSchema);
