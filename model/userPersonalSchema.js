/*
 * User Personal Schema
 * @path models/userPersonalSchema.js
 * @file userPersonalSchema.js
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
 * @description Defining ENUMs for the relation type field which will use for validation.
 */
var relationType = 'FATHER,MOTHER,SON,DAUGHTER,SPOUSE,GRANDFATHER,GRANDMOTHER,GREAT-GRANDFATHER,GREAT-GRANDMOTHER,AUNT,UNCLE,COUSIN'.split(',')

/**
 * @schema UserPersonalSchema
 * @description Personal Details of the User
 */
var UserPersonalSchema = new Base.BaseSchema({
    user: {
        type: ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    dob: {
        type: Date,
        trim: true
    },
    engineerRelative: {
        name: {
            type: String
        },
        relationAs: {
            type: String,
            enum: relationType
        },
        contact: {
            type: String,
            required: true
        },
        occupation: {
            type: String,
            required: true
        },
        relativesAnnualSalary: {
            type: Number,
            trim: true
        }
    },
    address: {
        type: String,
        trim: true
    },
    permanentAddress: {
        type: String,
        trim: true
    }
});

/**
 * Expose `UserPersonal` Model
 */
module.exports = Base.BaseModel.discriminator('UserPersonal', UserPersonalSchema);
