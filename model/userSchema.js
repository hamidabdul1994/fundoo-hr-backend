/*
 * User Schema
 * @path models/userSchema.js
 * @file userSchema.js
 */
'use strict';

/*
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs'),
    Base = require('./base'); // Include the base schema

var ObjectId = Schema.Types.ObjectId;

/**
 * @description Defining ENUMs for the gender field which will use for validation.
 */
var genders = 'MALE,FEMALE'.split(',');

/**
 * @description Defining ENUMs for the roles type field which will use for validation.
 */
var roles = 'ADMINISTRATOR,HUMAN RESOURCE,BUSINESS,FINANCE,MENTOR,REVIEWER'.split(',');

/**
 * @description Defining ENUMs for the engineer type field which will use for validation.
 */
var engineerTypes = 'FELLOWSHIP,INTERNSHIP,EMPLOYEMENT'.split(',');

/**
 * @description Validations
 */
var minlength = [3, 'The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH}).'];

/**
 * @schema  UserSchema
 * @description User details 
 */
var UserSchema = new Base.BaseSchema({
    username: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, '{PATH} is required.'], //match: /^[\w][\w\-\.]*[\w]$/i,
        // match: [
        //     new RegExp('^[a-z0-9_.-]+$', 'i'),
        //     '{PATH} \'{VALUE}\' is not valid. Use only letters, numbers, underscore or dot.'
        // ],
        minlength: minlength,
        maxlength: 60
    },
    password: {
        type: String,
        required: false, // Only required if local
        trim: true,
        match: new RegExp('^.{8,64}$')
    },
    engineerID: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    emailAddress: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        //validate: [validate.email, 'invalid email address']
    },
    engineerType: {
        type: String,
        enum: {
            values: engineerTypes,
            message: 'Please select an Engineer Type. Engineer type cannot be blank.'
        }
    },
    gender: {
        type: String,
        enum: genders
    },
    isSuperAdmin: {
        type: Boolean,
        trim: true,
        default: false
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                var re = /^\d{10}$/;
                return (v == null || v.trim().length < 1) || re.test(v)
            },
            message: 'invalid phone number.'
        }
    },
    avatarImg: {
        type: ObjectId,
        ref: 'images'
    },
    lastIPAddress: String
});

/**
 * Get `fullName` from `firstName` and `lastName`
 *
 * @return {String} fullName
 * @api public
 */
UserSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});

/**
 * Set `fullName` from `String` param splitting
 * and calling firstName as first value and lastName
 * as the concatenation of the rest values
 *
 * @param {String} name
 * @return {User}
 * @api public
 */
UserSchema.virtual('fullName').set(function (name) {
    var split = name.split(' ');
    if (split.length) {
        this.firstName = split.shift();
        this.lastName = split.join(' ');
    }

    return this;
});

/**
 * Find `User` by its email
 * 
 * @param {String} email
 * @return {Error} err
 * @return {User} user
 * @api public
 */
UserSchema.methods.findByEmail = function (email, cb) {
    return this.findOne({
            emailAddress: email
        })
        .exec(cb);
}


/**
 * Find `User` by its id
 * 
 * @param {String} id
 * @return {Error} err
 * @return {User} user
 * @api public
 */
UserSchema.methods.getUserById = function (id, callback) {
    User.findById(id, callback);
};


/**
 * Find `User` by its username
 * 
 * @param {String} username
 * @return {Error} err
 * @return {User} user
 * @api public
 */
UserSchema.methods.getUserByUsername = function (username, callback) {
    var query = {
        username: username
    };
    User.findOne(query, callback);
};


/**
 * Compare User Password `User` by passing candidatePassword
 * 
 * @param {String} candidatePassword
 * @return {Error} err
 * @return Void
 * @api public
 */
UserSchema.methods.comparePassword = function (candidatePassword, hash, callback) {
    // Load hash from your password DB.
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        callback(null, isMatch);
    });
};

/**
 * createUser `User` by newUser Object
 * 
 * @param {Object} newUser
 * @return {Error} err
 * @return Void
 * @api public
 */
UserSchema.methods.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(function (error, data, affected) {
                console.error(error);
                if (error && error.code !== 11000) {
                    if (error.name == 'ValidationError') {
                        for (var field in error.errors) {
                            return callback(error.errors[field].MongooseError, null);
                        }
                    } else {
                        return callback('Something bad happened. Please contact system administrator', null);
                    }
                }
                //duplicate key
                if (error && error.code === 11000) {
                    return callback('User already registered', null);
                } else {
                    return callback(null, data);
                }
                console.log('Inserted new user');
            });
        });
    });
};

UserSchema.pre('save', function (next) {
    var now = new Date().getTime();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

/**
 * Expose `User` Model
 */
module.exports = {
    UserModel: Base.BaseModel.discriminator('User', UserSchema), //mongoose.model('User', UserSchema);
    UserSchema: UserSchema
};