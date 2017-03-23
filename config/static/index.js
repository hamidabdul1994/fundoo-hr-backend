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

module.exports = {
    validationSchema: validationSchema,
    checkSystemErrors: checkSystemErrors,
    defaultResult: defaultResult
}