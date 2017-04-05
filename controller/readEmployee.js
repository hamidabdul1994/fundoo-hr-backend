var Express = require('express');
var router = Express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");
var config = require('../config/static');
var models = require("../model");

router.get("/:requiredData", function(request, response) {
    var result1 = {},
        errors;
    try {
      result1 = undefined;
        result1 = config.defaultResult; //Setting Default Result as false
        console.log(JSON.stringify(config.defaultResult));
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
                    result1.status = true;
                    result1.message = "Successfully Generated";
                    var schemaName = config.enumData.schemaNames[employeeArea];
                    models[schemaName].find(function(err, employeeDataArry) {
                        // employeeDataArry = employeeDataArry.map(function (employeeData) {
                        //   return employeeData.toJSON();
                        // });
                        result1[employeeArea + "Data"] = employeeDataArry;
                        response.send(result1);
                    return;
                    });
                } catch (e) {
                    if (!config.checkSystemErrors(e)) {
                        result1.message = e;
                    }
                    response.send(result1);
                    return;
                }
            });
        }
    } catch (e) {
        if (!config.checkSystemErrors(e)) {
            result1.status = false;
            result1.message = e;
        }
        response.status(401).json(result1);
        return;
    }finally{
      response.on("finish",function () {
        for (var i in result1) {
          if(i!=="status" || i!=="message")
          delete result1[i]; //Deleting Rest of Garbage data
        }
      //   result1 = {};
      //
      // result1 = undefined;
      // employeeArea = undefined;
        console.log("finish");
      });
    }

});

module.exports = router;
