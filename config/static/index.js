/**
 * @description Validation object for the data requested.
 */
var validationSchema = {
    "signup": {
        'emailAddress': { in: 'body',
            notEmpty: {
                errorMessage: 'No emailAddress or empty emailAddress. emailAddress field is require & cannot be blank.'
            },
            isEmail: {
                errorMessage: 'Enter a valid email address.'
            }
        },
        'password': { in: 'body',
            notEmpty: {
                errorMessage: 'Empty password. password cannot be blank.'
            }
        },
        'firstName': { in: 'body',
            notEmpty: {
                errorMessage: 'Empty First Name. First Name cannot be blank.'
            }
        }
    },
    "loginValidation": {
        'emailAddress': { in: 'body',
            notEmpty: {
                errorMessage: 'No emailAddress or empty emailAddress. emailAddress field is require & cannot be blank.'
            },
            isEmail: {
                errorMessage: 'Enter a valid email address.'
            }
        },
        'password': { in: 'body',
            notEmpty: {
                errorMessage: 'Empty password. password cannot be blank.'
            }
        }
    },
    "userAuth": {
        'emailAddress': { in: 'body',
            notEmpty: {
                errorMessage: 'No emailAddress or empty emailAddress. emailAddress field is require & cannot be blank.'
            },
            isEmail: {
                errorMessage: 'Enter a valid email address.'
            }
        }
    },
    "hr": {
        "user": { in: 'body',
            notEmpty: {
                errorMessage: 'User field is require & cannot be blank.'
            }
        },
        "hiringCity": { in: 'body',
            notEmpty: {
                errorMessage: 'hiringCity field is require & cannot be blank.'
            }
        },
        "fellowshipPeriod": {},
        "bridgelabzStartDate": {},
        "companyStartDate": {},
        "companyEndDate": {},
        "enggContractInitiated": {},
        "enggContractSigned": {},
        "companyContractInitiated": {},
        "companyContractSigned": {},
        "contractSignDate": {},
        "initiateTransfer": {}
    },
    "employeeData":{
      "engineerID": { in: 'query',
          notEmpty: {
              errorMessage: 'engineerID field is require & cannot be blank.'
          }
      }
    }
};

/**
 * @description Default return object for all the other system/Programming errors
 * @key status @value false
 * @key message @value Something Bad Happened. Please contact system administrator.
 */
var defaultResult = {
    "status": false,
    "message": "Something Bad Happened. Please contact system administrator."
};

/**
 * @description Checks the system errors & returns true if system/programming errors
 * @param {any} err type object/string
 * @returns Boolean true/false
 */
var checkSystemErrors = function(err) {
    return err instanceof TypeError ||
        err instanceof SyntaxError ||
        err instanceof EvalError ||
        err instanceof RangeError ||
        err instanceof ReferenceError;
}

/**
 * @description Checks The Emplyee Data Field
 * @param {any} type object/string
 * @returns Array
 */
var employeeArea = ["hr", "personal", "profile", "bank", "track"];

module.exports = {
    validationSchema: validationSchema,
    checkSystemErrors: checkSystemErrors,
    defaultResult: defaultResult,
    employeeArea: employeeArea
}
