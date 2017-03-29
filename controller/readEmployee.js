var Express = require('express');
var router = Express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");
var config = require('../config/static');

router.get("/:requiredData", function(request, response) {
    var result = {},
        errors;
    try {
        result = config.defaultResult; //Setting Default Result as false
        var employeeArea = request.params.requiredData;
        if (config.enumData.employeeArea.indexOf(employeeArea) === -1) {
            throw "Bad Parameter Conntact to administrator"; //Generating Error While not Finding param in array
        } else {
            // if (typeof config.validationSchema.employeeData != undefined) {
            request.check(config.validationSchema.employeeData);
            request.getValidationResult().then(function(isValid) {
                try {
                    if (!isValid.isEmpty()) {
                        errors = request.validationErrors(); // isValid = isValid.useFirstErrorOnly();
                        throw errors[0].msg;
                    }
                    result.status = true;
                    result.message = "Successfully Generated";
                    result[employeeArea] = {
                        "data": "data"
                    };
                    var updateData = request.body;
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
