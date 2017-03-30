var express = require('express'),
    util = require('util'),
    firebase = require("../config/database/firebase"),
    commonMethod = require("../common/commonMethod"),
    config = require('../config/static/'),
    User = require('../model/userSchema').User,
    router = express.Router();

router.post("/", function (request, response) {
    var result, errors;
    try {
        request.filter();
        request.check(config.validationSchema.loginValidation);
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
            var email = request.body.emailAddress,
                password = request.body.password;
                User.getUserByUsernameAndPassword({username:email},function (err,data) {
                  console.log(data);
                });
            // firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            //     result.message = "Failed to authenticate user. ";
            //     var convertErrorObj = JSON.stringify(error, null, 4);
            //     var errorMessage = JSON.parse(convertErrorObj).message;
            //     console.error(convertErrorObj);
            //     console.error(errorMessage);
            //     result.message += errorMessage;
            //     response.status(401).send(result);
            // }).then(function (data) {
            //     result.status = true;
            //     result.message = "User logged in login Successfully";
            //     token = commonMethod.generateToken(email);
            //     response.setHeader("x-token", token);
            //     response.status(200).json(result);
            //     console.log(result);
            // });
        } catch (e) {
            !config.checkSystemErrors(e) || (result.message = e.message);
            console.error(e);
            response.status(401).json(result);
        };
    });
});

module.exports = router;