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
    "employeeData": {
        "engineerID": { in: 'query',
            notEmpty: {
                errorMessage: 'engineerID field is require & cannot be blank.'
            }
        }
    },
    "employeeDataPut": {
        "engineerID": { in: 'body',
            notEmpty: {
                errorMessage: 'engineerID field is require & cannot be blank.'
            }
        }
    },
    "emailSend": {
        "date": { in: "body",
            notEmpty: {
                errorMessage: 'Date field is require & cannot be blank.'
            }
        }
    }
};
/**
 * @description Validation object for the data requested.
 */
var emailTemplate = {
    "leave": {
        from: '"BridgeLabz Admin" <fundoohr2016@gmail.com>', // sender address
        to: "#email", // list of receivers
        subject: 'Regarding Leave  ', // Subject line
        // text: 'Hello world ', // plaintext body
        html: '<b>Hello #name </b><br/><p>It is to bring to your kind notice That you have taken extra leaves, So your Payment could be deductd as per your number of leaves, which is you taken. </p><br/><br/>\
      If you have any queries please contact admin using the given link :<a href="http://localhost/fundooHrAdmin">http://localhost/fundooHrAdmin</a><br/> Thanking you' // html body
    },
    "unmarked": {
        from: '"BridgeLabz Admin" <fundoohr2016@gmail.com>', // sender address
        to: "#email", // list of receivers
        subject: 'Regarding Attendance', // Subject line
        html: '<b>Hello #name </b><br/><p>Please mark your Attendance for date: #date </p>Mark Attendance using <a href="http://localhost/fundooHr">http://localhost/fundooHr</a><br/> Thanking you' // html body
    },
    "fallout": {
        from: '"BridgeLabz Admin" <fundoohr2016@gmail.com>', // sender address
        to: '#email', // list of receivers'hamidabdul1994@gmail.com'
        subject: 'Regarding Attendance Fallout ', // Subject line
        // text: 'Hello world ', // plaintext body
        html: '<b>Hello #name!</b><br/><p>It is to bring to your kind notice That you have failed to mark your attendance for three and more than three days in a month #date .Please do so immediately </p><br/>Mark Attendance using <a href="http://localhost/fundooHr">http://localhost/fundooHr</a><br/>\
      If you have any queries please contact admin using the given link :<a href="http://localhost/fundooHrAdmin">http://localhost/fundooHrAdmin</a><br/> Thanking you' // html body
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
var enumData = {
    "employeeArea": ["hr", "personal", "profile", "bank", "track"],
    "notificationType": ["unmarked", "fallout", "leave"],
    "schemaNames":{"hr":"UserHRDetails", "personal":"UserProfile", "profile":"UserPersonal",
    "bank":"UserBank", "track":"UserTracking"}
};

module.exports = {
    validationSchema: validationSchema,
    checkSystemErrors: checkSystemErrors,
    defaultResult: defaultResult,
    enumData: enumData,
    emailTemplate: emailTemplate
};
