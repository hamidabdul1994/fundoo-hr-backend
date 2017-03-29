var express = require('express');
var router = express.Router();
var config = require('../config/static');


router.post("/:notificationType", function(request, response) {
    var result = {},
        errors;
    try {
        result = config.defaultResult; //Setting Default Result as false
        var notificationType = request.params.notificationType;
        if (config.enumData.notificationType.indexOf(notificationType) === -1) {
            throw "Bad Parameter Conntact to administrator"; //Generating Error While not Finding param in array
        } else {
            // if (typeof config.validationSchema.employeeData != undefined) {
            request.check(config.validationSchema.emailSend);
            request.getValidationResult().then(function(isValid) {
                try {
                    if (!isValid.isEmpty()) {
                        errors = request.validationErrors(); // isValid = isValid.useFirstErrorOnly();
                        throw errors[0].msg;
                    }
                    //Here we will put business logic
                    result.status = true;
                    result.message = "Successfully Sent mail Generated";
                    response.send(result);
                } catch (e) {
                    if (!config.checkSystemErrors(e)) {
                        result.message = e;
                    }
                    response.status(401).json(result);
                }
            });
        }
    } catch (e) {
        if (!config.checkSystemErrors(e)) {
            result.message = e;
        }
        console.log(JSON.stringify(result));
        response.status(401).json(result);
    }

});

module.exports = router;
