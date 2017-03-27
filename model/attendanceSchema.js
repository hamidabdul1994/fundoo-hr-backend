/*
 * Attendance Schema
 * @path models/attendanceSchema.js
 * @file attendanceSchema.js
 */
'use strict';

/*
 * Module dependencies
 */
var mongoose = require('mongoose'),
    User = require('./userSchema'),
    Client = require('./clientSchema'),
    Base = require('./base'); // Include the base schema

var ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * @schema  HolidaySchema
 * @description Holiday details 
 */
var ClientHolidaySchema = new Base.BaseSchema({
    client: {
        type: ObjectId,
        ref: 'client'
    },
    date: {
        type: Date,
        ref: 'User'
    },
    occasion: {
        type: String,
        trim: true
    }
});

/**
 * @schema AttendanceSchema
 * @description Attendance details 
 */
var AttendanceSchema = new Base.BaseSchema({
    user: {
        type: ObjectId,
        ref: 'User',
		unique: true,
		required: true
    },
    inTime: {
        type: Date,
        trim: true
    },
    outTime: {
        type: Date,
        trim: true
    },
    isPresent: {
        type: Boolean,
        trim: true
    },
    reason: {
        type: true,
        trim: true
    },
    holiday: {
        type: ObjectID,
        ref: HolidaySchema
    }
});

/**
 * Expose `Attendance` & `Client` Model
 */
module.exports = {
    AttendanceModel: mongoose.model('Attendance', AttendanceSchema),
    ClientHolidayModel: mongoose.model('Holiday', ClientHolidaySchema)
};
