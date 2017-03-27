var jwt = require('jwt-simple');
var moment = require('moment');
var firebase = require("../config/database/firebase.js");
var fs = require('fs');
var commonMethod = {};
//var nodemailer = require('nodemailer');
var config = {};
config.TOKEN_SECRET = process.env.TOKEN_SECRET || 'nk235jaih535lhgdszhdfb-89ddsaj';

/**       Mehtod is for reading employee HR data        **/
commonMethod.updateEmployeeData = function(engineerId, field, obj) {
    return new Promise(function(resolve, reject) {
        if (engineerId === undefined) {
            reject(404);
        }
        var ref = firebase.database().ref("employee/" + engineerId);
        ref.once("value", function(value) {
            if (value.val() !== null) {
                ref.child(field).update(obj).then(function() {
                    resolve();
                }).catch(function(e) {
                    reject();
                });
            } else {
                reject(404);
            }

        });

    });
};

/*****      Method is for sending mail ******/
commonMethod.sendEmail = function(mailOptions) {
    new Promise(function(resolve, reject) {
        //var transporter = nodemailer.createTransport('smtps://fundoohr2016%40gmail.com:bridgeit@smtp.gmail.com');

        // send mail with defined transport object
        /*transporter.sendMail(mailOptions, function(error, info){
    if(error){
    reject(error);
  }else {
  resolve(info.response);
}

});*/
    });
};
/*****      Method is for reading the JSON       *****/

commonMethod.readJSON = function(fileName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fileName, 'utf8', function(err, data) {
            if (err) throw err;
            resolve(data);
        });
    });
};
/*****      Method is for reading the employee details for particular field        *****/

commonMethod.readEmployeeByFieldData = function(engineerId, field) {
    return new Promise(function(resolve, reject) {
        var ref = firebase.database().ref("employee/" + engineerId);
        ref.child(field).once("value").then(function(data) {
            if (data.val() !== null) {
                resolve(data.val());
            } else {
                reject();
            }
        });
    });
};

/**       Mehtod is for inserting employee Attendance Data in firebase          **/
commonMethod.createEmployeeAttendance = function(engineerId, date, obj) {
    return new Promise(function(resolve, reject) {
        //For Structure issue Convert into String
        var dateSplit = date.split("/");
        date = dateSplit[0] + "/" + dateSplit[1] + "/day" + dateSplit[2];
        firebase.database().ref("employee/" + engineerId).once("value", function(emp) {
            if (emp.val() === null) {
                reject();
            } else {
                var ref = firebase.database().ref("employeeAttendance/" + engineerId);
                ref.child(date).set(obj);
                ref.once("value", function(data) {
                    resolve("Data");
                });
            }
        });

    });
};

commonMethod.readEmployeeAttendance = function(engineerId, date) {
    return new Promise(function(resolve, reject) {
        var dateSplit = date.split("/");

        // date =dateSplit[0]+"/"+dateSplit[1]+"/day"+dateSplit[2];
        firebase.database().ref("employee/" + engineerId).once("value").then(function(emp) {
            if (emp.val() === null) {
                reject();
            }
        });
        var ref = firebase.database().ref("employeeAttendance/" + engineerId + "/" + date);
        ref.once("value").then(function(data) {
            if (data.val() !== null) {
                var temp = {};
                for (var d in data.val()) {
                    var day = Number.parseInt(d.replace(/^\D+/g, ''));
                    temp[day] = data.val()[d];
                }
                resolve(temp);
            } else {
                resolve({});
            }
        });
    })
};

commonMethod.generateToken = function(user) {
    var payload = {
        sub: user,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
};
commonMethod.verifyToken = function(token) {
    try {
        jwt.decode(token, config.TOKEN_SECRET);
    } catch (e) {
        throw 401;
    }

}
commonMethod.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

commonMethod.getFullTimeStamp = function(timestamp) {
    if (timestamp !== undefined) {
        timestamp = Number.parseInt(timestamp);
        now = new Date(timestamp);
    } else {
        now = new Date();
    }
    return (now.getFullYear() + "/" +
        (commonMethod.month[now.getMonth()]) + '/' +
        now.getDate());
}
commonMethod.getMonthTimeStamp = function(timestamp) {
    if (timestamp !== undefined) {
        timestamp = Number.parseInt(timestamp);
        now = new Date(timestamp);
    } else {
        now = new Date();
    }
    return (now.getFullYear() + "/" +
        (commonMethod.month[now.getMonth()]));
}

commonMethod.isSunday = function(year, month, day) {
    var myDate = new Date(year + "/" + month + "/" + day);
    if (myDate.getDay() === 0)
        return true;
    else
        return false;
}
commonMethod.monthDays = function(time) {
    var date = new Date(Number.parseInt(time));
    var d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return d.getDate();
}

module.exports = commonMethod;
