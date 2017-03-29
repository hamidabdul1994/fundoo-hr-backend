var Express = require('express');
var router = Express.Router();
var commonMethod = require("../common/commonMethod");
var config = require('../config/static');

router.put("/:requiredData", function(request, response) {
    var result = {},
        errors;
    try {
        result = config.defaultResult; //Setting Default Result as false
        if (config.employeeArea.indexOf(request.params.requiredData) === -1) {
            throw "Bad Parameter Conntact to administrator"; //Generating Error While not Finding param in array
        }else {
          request.check(config.validationSchema.employeeDataPut);
          request.getValidationResult().then(function(isValid) {
            try {
              if (!isValid.isEmpty()) {
                  errors = request.validationErrors(); // isValid = isValid.useFirstErrorOnly();
                  throw errors[0].msg;
              }
              result.status = true;
              result.message = "Successfully update";
              var updateData = request.body;
              response.send(result);
            } catch (e) {
              if (!config.checkSystemErrors(e)) {
                  result.message = e;
              }
              response.status(401).json(result);
            }

      // }

    });
        }
        result.status = true;
    } catch (e) {
        if (!config.checkSystemErrors(e)) {
            result.message = e;
        }
        response.status(401).json(result);
    }

});

module.exports = router;
