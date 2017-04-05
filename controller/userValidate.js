var express = require('express'),
    firebase = require("../config/database/firebase"),
    commonMethod = require("../common/commonMethod"),
    config = require('../config/static/'),
    router = express.Router();

router.post("/", function (request, response) {
    var result, errors;
    try {
        request.filter();
        request.check(config.validationSchema.userAuth);
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
            var email = request.body.emailAddress;
            
            var refEmployee = firebase.database().ref("employee");
            var postsRef = refEmployee.orderByChild("personal/email");
            postsRef.equalTo(email).on("value", function (data) {
                if (data.val() !== null) {
                    result.status = true;
                    result.message = "User authenticated Successfully";
                    token = commonMethod.generateToken(email);
                    response.setHeader("x-token", token);
                    response.status(200).json(result);
                    console.log(result);
                } else {
                    result.message = 'Email Address not registered.';
                    response.status(401).json(result);
                }
            });
        } catch (e) {
            !config.checkSystemErrors(e) || (result.message = e.message);
            console.error(e);
            response.status(401).json(result);
        };
    });
});
module.exports = router;