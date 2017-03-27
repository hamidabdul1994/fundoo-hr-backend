var express = require('express'),
    util = require('util'),
    db = require('../config/database/mongodb'),
    firebase = require("../config/database/firebase"),
    commonMethod = require("../common/commonMethod"),
    config = require('../config/static/'),
    User = require('../model/userSchema'),
    router = express.Router();

router.post("/", function(request, response, next) {
    var result, errors;
    try {
        request.filter();
        request.check(config.validationSchema.signup);
        result = config.defaultResult;
    } catch (e) {
        var result = {};
        result.status = false;
        result.message = "Something bad happened. Please contact system Administrator.";
        console.error(e);
        response.status(401).json(result);
    };
    request.getValidationResult().then(function(isValid) {
        try {
            if (!isValid.isEmpty()) {
                errors = request.validationErrors(); // isValid = isValid.useFirstErrorOnly();
                console.error(errors[0].msg);
                throw errors[0].msg;
            }
            var newUser = new User.User({
                username: request.body.emailAddress,
                password: request.body.password,
                emailAddress: request.body.emailAddress,
                firstName: request.body.firstName || '',
                lastName: request.body.lastName || '',
                gender: request.body.gender,
                phone: request.body.phone || '',
                engineerID: request.body.engineerID || '',
                engineerType: request.body.engineerType || '',
            });
            User.User.register(newUser, request.body.password, function(error, data) {
                try {
                    if (error) {
                        if (error.name == 'ValidationError') {
                          console.log(error);
                            for (var field in error.errors) {
                                if(error.errors[field].kind == 'enum'){
                                    if(typeof error.errors[field].message !== undefined)
                                        throw error.errors[field].message;
                                    throw 'Invalid '+error.errors[field].path+'. Please select a valid value';
                                }else if(error.errors[field].kind == 'Duplicate value'){
                                    throw 'A user with the given '+error.errors[field].path+' is already registered';
                                }else if(error.errors[field].kind == 'required'){
                                    throw 'A user must have '+error.errors[field].path+'. Please enter select/enter some value.';
                                }
                            }
                        } else if(error.name == 'UserExistsError'){
                            throw 'A user with the given Username is already registered';
                        }
                        throw new Error(error);
                    }
                    token = commonMethod.generateToken(request.body.emailAddress);
                    result.status = true;
                    result.message = "User registered successfully";
                    response.send(result);
                } catch (e) {
                    if(!config.checkSystemErrors(e)) {
                        result.message = e;
                    }
                    console.error(e);
                    response.status(401).json(result);
                };
            });
        } catch (e) {
            if(!config.checkSystemErrors(e)) {
                result.message = e;
            }
            console.error(e);
            response.status(401).json(result);
        };
    });
});

module.exports = router;
