var express = require('express'),
    util = require('util'),
    db = require('../config/database/mongodb'),
    firebase = require("../config/database/firebase"),
    commonMethod = require("../common/commonMethod"),
    config = require('../config/static/'),
    User = require('../model/userSchema'),
    router = express.Router();
router.post("/", function (request, response) {
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
    request.getValidationResult().then(function (isValid) {
        try {
            if (!isValid.isEmpty()) {
                errors = request.validationErrors(); // isValid = isValid.useFirstErrorOnly();
                console.error(errors);
                throw new Error(errors[0].msg);
            }
            var newUser = new User.UserModel({
                username: request.body.emailAddress,
                password: request.body.password,
                emailAddress: request.body.emailAddress,
                firstName : request.body.firstName || '',
                lastName : request.body.lastName || '',
                gender : request.body.gender,
                phone : request.body.phone || '',
                engineerID : request.body.engineerID || '',
                engineerType : request.body.engineerType || '',
            });
            console.log(newUser);
            User.UserSchema.methods.createUser(newUser, function(error, data){
                if(error){
                    throw new Error(error);
                }
                token = commonMethod.generateToken(request.body.emailAddress);
                result.status = true;
                result.message = "User registered successfully";
                response.send(result);
            });
        } catch (e) {
            !config.checkSystemErrors(e) || (result.message = e.message);
            console.error("Catch Block: ",e);
            response.status(401).json(result);
        };
    });
});

module.exports = router;