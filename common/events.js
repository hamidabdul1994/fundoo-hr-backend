var EventEmitter = require('events').EventEmitter;
var util = require('util');
var firebase = require("../config/database/firebase.js");
var redisClient = require('redis').createClient();

// Network interfaces
var os = require('os').networkInterfaces();

// Iterate over interfaces ...
var ip = Object.keys(os).reduce(function(result, dev) {
    return result.replace("lo", "").concat(os[dev].reduce(function(result, details) {
        return result.concat(details.family === 'IPv4' && !details.internal ? [details.address] : []);
    }, []));
});
// 14344, 'redis-14344.c10.us-east-1-4.ec2.cloud.redislabs.com', {no_ready_check: true}
// 16385,"redis-16385.c11.us-east-1-3.ec2.cloud.redislabs.com",{no_ready_check: true}, hamidAbdul1994
var imageUrl = "http://" + ip + ":3000/image2.jpg";

function custEvent() {
    var self = this;
    EventEmitter.call(this);
}

util.inherits(custEvent, EventEmitter);
var myCustEvent = new custEvent();

module.exports = myCustEvent;

/****          employeeSnapshot Method       ****/
custEvent.prototype.employeeSnapshot = function(tempObj, engineerId) {
    redisClient.hgetall("employeeSnapshot", function(error, employeeData) {
        if (employeeData === null || employeeData[engineerId] === undefined) {
            console.log("Data", engineerId, employeeData[engineerId]);
            readEmployeeSnapshot(function(temp) {
                console.log("Data", temp[engineerId]);
                tempObj.employeeData = JSON.parse(temp[engineerId]);
                tempObj.employeeData.imageUrl = imageUrl;
                myCustEvent.emit("employeeSnapshot", tempObj);
                redisClient.hmset("employeeSnapshot", temp);
            });
        } else {
            tempObj.employeeData = JSON.parse(employeeData[engineerId]);
            tempObj.employeeData.imageUrl = imageUrl;
            `  `
            myCustEvent.emit("employeeSnapshot", tempObj);
        }
    });
};

custEvent.prototype.createEmployeeLeave = function(engineerId, date) {
    redisClient.hgetall("employeeLeave", function(error, employeeData) {
        if (employeeData === null || employeeData[date] === undefined) {

            var temp = {};
            var tempArry = [];
            tempArry.push(engineerId);
            temp[date] = JSON.stringify(tempArry);
            myCustEvent.updateEmployeeLeaveSnapshot(engineerId);
            redisClient.hmset("employeeLeave", temp);
        } else {
            var temp = JSON.parse(employeeData[date]);
            if (temp.indexOf(engineerId) === -1) { //Avoid Duplicate
                temp.push(engineerId);
                var tempObj = {};
                tempObj[date] = JSON.stringify(temp);
                myCustEvent.updateEmployeeLeaveSnapshot(engineerId);
                redisClient.hmset("employeeLeave", tempObj);
            }

        }
    });
};
custEvent.prototype.readEmployeeSnapshot = function(engineerId) {
    return new Promise(function(resolve, reject) {
        redisClient.hgetall("employeeSnapshot", function(error, employeeData) {
            var obj = [];
            engineerId.forEach(function(id) {
                var engg = JSON.parse(employeeData[id]);
                engg.imageUrl = imageUrl;
                engg.engineerId = id;
                obj.push(engg);
            });
            var totalEmployee = Object.keys(employeeData).length;
            resolve({
                "employeeSnapshot": obj,
                totalEmployee
            });
        });
    });
}

custEvent.prototype.searchEmployee = function() {

    var ref = firebase.database().ref("employee");
    ref.once("value", function(value) {
        if (value.val() !== null)
            myCustEvent.emit("employeeList", Object.keys(value.val()));
        else
            myCustEvent.emit("employeeList", []);
    });

};
custEvent.prototype.readTotalEmployee = function() {
    redisClient.hgetall("employeeSnapshot", function(error, employeeData) {
        if (employeeData !== null)
            myCustEvent.emit("totalEmployee", Object.keys(employeeData).length);
    });
};
/*****           readEmployeeUnmarkedAttendance Method    *****/
custEvent.prototype.readEmployeeUnmarkedAttendance = function(date, i) {
    return new Promise(function(resolve, reject) {
        redisClient.hgetall("employeeUnmarkedAttendance", function(error, employeeUnmarkedAttendance) {
            if (employeeUnmarkedAttendance === null || employeeUnmarkedAttendance[date] === undefined) {
                var ref = firebase.database().ref();
                var empRef = ref.child("employee");
                var dateSplit = date.split("/");
                var date1 = dateSplit[0] + "/" + dateSplit[1] + "/day" + dateSplit[2];
                var markedRef = ref.child("employeeAttendance").orderByChild(date1 + "/markedStatus").startAt("");
                markedRef.on("value", function(data) {
                    empRef.on("value", function(empData) {
                        if (data.val() === null) {
                            /**If Attendance for given date having null so all engineer will make unmarked**/
                            var obj = {};
                            obj[date] = JSON.stringify(Object.keys(empData.val()));
                            redisClient.hmset("employeeUnmarkedAttendance", obj);
                            if (i !== undefined) {
                                resolve({
                                    "day": i,
                                    "unmarked": String(Object.keys(empData.val()).length) //String Form
                                });
                            } else {
                                resolve(Object.keys(empData.val()));
                            }

                        } else {
                            /**If Attendance for given date having data, so rest of engineer will make unmarked**/
                            var attendanceEmp = Object.keys(data.val());
                            var empData = Object.keys(empData.val());
                            attendanceEmp.forEach(function(engId) {
                                empData = removeArrayData(empData, engId);
                            });
                            var obj = {};
                            obj[date] = JSON.stringify(empData);
                            redisClient.hmset("employeeUnmarkedAttendance", obj);
                            if (i !== undefined) {
                                resolve({
                                    "day": i,
                                    "unmarked": String(empData.length)
                                });
                            } else {
                                resolve(empData);
                            }

                        }
                    });
                });
            } else {
                if (i !== undefined) {
                    resolve({
                        "day": i,
                        "unmarked": String(JSON.parse(employeeUnmarkedAttendance[date]).length)
                    });
                } else {
                    resolve(JSON.parse(employeeUnmarkedAttendance[date]));
                }

            }
        });
    });
};
custEvent.prototype.readFalloutEmployee = function(date, monthDays) {
    return new Promise(function(resolve, reject) {
        redisClient.hgetall("employeeUnmarkedAttendance", function(error, employeeAttendance) {
            var obj = {};
            for (var key = 1; key <= monthDays; key++) {
                var temp = employeeAttendance[date + "/" + key] !== undefined ? (JSON.parse(employeeAttendance[date + "/" + key])) : [];
                var p = temp.forEach(function(value) {
                    if (obj[value] !== undefined) {
                        obj[value] = {
                            "value": ++obj[value].value
                        };
                    } else {
                        obj[value] = {
                            "value": 0
                        };
                    }
                });

            }
            Promise.all([p]).then(function() {
                var temp = [];
                for (var i in obj) {
                    if (obj[i].value >= 3) {
                        temp.push(i);
                    }
                }
                resolve(temp);
            });
        });
    });
};

custEvent.prototype.readLeaveEmployee = function(date, monthDays) {
    return new Promise(function(resolve, reject) {
        redisClient.hgetall("employeeLeave", function(error, employeeLeave) {
            var obj = {};
            if (employeeLeave === null) {
                resolve([]);
            } else {
                for (var key = 1; key <= monthDays; key++) {
                    var temp = employeeLeave[date + "/" + key] !== undefined ? (JSON.parse(employeeLeave[date + "/" + key])) : [];
                    var p = temp.forEach(function(value) {
                        if (obj[value] !== undefined) {
                            obj[value] = {
                                "value": ++obj[value].value
                            };
                        } else {
                            obj[value] = {
                                "value": 1
                            };
                        }
                    });
                }
                Promise.all([p]).then(function() {
                    var temp = [];
                    for (var i in obj) {
                        if (obj[i].value >= 2) {
                            temp.push(i);
                        }
                    }
                    resolve(temp);
                });
            } //Else End
        });
    });
};
/****       creatEmployeeUnmarkedAttendance Method       *****/
custEvent.prototype.creatEmployeeUnmarkedAttendance = function(engineerId, date) {
    var obj = {};
    redisClient.hgetall("employeeUnmarkedAttendance", function(error, employeeUnmarkedAttendance) {
        if (employeeUnmarkedAttendance === null || employeeUnmarkedAttendance[date] === undefined) {
            var ref = firebase.database().ref("employee");
            ref.once("value", function(data) {
                var obj = {};
                obj[date] = JSON.stringify(removeArrayData(Object.keys(data.val()), engineerId));
                redisClient.hmset("employeeUnmarkedAttendance", obj);
            });
        } else {
            var unmarkedObj = removeArrayData(JSON.parse(employeeUnmarkedAttendance[date]), engineerId);
            employeeUnmarkedAttendance[date] = JSON.stringify(unmarkedObj);
            redisClient.hmset("employeeUnmarkedAttendance", employeeUnmarkedAttendance);
        }
    });

};

/****            updateEmployeeHRSnapshot Method              ****/
custEvent.prototype.updateEmployeeHRSnapshot = function(engineerId, obj) {
    redisClient.hgetall("employeeSnapshot", function(error, employeeData) {
        var temp = JSON.parse(employeeData[engineerId]);
        temp.employeeStatus = obj.employeeStatus;
        temp.company = obj.company;
        temp.blStartDate = obj.blStartDate;
        temp.companyJoinDate = obj.companyJoinDate;
        temp.companyLeaveDate = obj.companyLeaveDate;
        var tempObj = {};
        tempObj[engineerId] = JSON.stringify(temp);
        redisClient.hmset("employeeSnapshot", tempObj);
    });
};
custEvent.prototype.updateEmployeeLeaveSnapshot = function(engineerId) {
    /** COde for Increament the leaveTaken by eningeer in redis**/
    redisClient.hgetall("employeeSnapshot", function(error, employeeSData) {
        if (employeeSData === null || employeeSData[engineerId] === undefined) {
            readEmployeeSnapshot(function(temp) {
                var tempObj = JSON.parse(temp[engineerId]);
                tempObj.leaveTaken += 1;
                var empTemp = {};
                empTemp[engineerId] = JSON.stringify(tempObj);
                redisClient.hmset("employeeSnapshot", empTemp);
            });
        } else {
            var tempObj = JSON.parse(employeeSData[engineerId]);
            tempObj.leaveTaken += 1;
            var empTemp = {};
            empTemp[engineerId] = JSON.stringify(tempObj);
            redisClient.hmset("employeeSnapshot", empTemp);
        }
    });

};
/*****         updateEmployeePersonalSnapshot Method        *****/
custEvent.prototype.updateEmployeePersonalSnapshot = function(engineerId, obj) {
    redisClient.hgetall("employeeSnapshot", function(error, employeeData) {
        var temp = JSON.parse(employeeData[engineerId]);
        temp.employeeName = obj.employeeName;
        temp.mobile = obj.mobile;
        temp.emailId = obj.emailId;
        var tempObj = {};
        tempObj[engineerId] = JSON.stringify(temp);
        redisClient.hmset("employeeSnapshot", tempObj);
    });

};


/***  Method to add Set in Redis   ***/
custEvent.prototype.dummy = function(data) {
    return new Promise(function(resolve, reject) {
        redisClient.sadd("searchKey", data);
        redisClient.smembers("searchKey", function(err, reply) {
            resolve(reply);
        });
    });
};
/** function Matching the pattern***/
custEvent.prototype.searchDummy = function(searchValue, cursor) {
    return new Promise(function(resolve, reject) {
        var tempArray = [];
        redisClient.sscan('searchKey', cursor, 'MATCH', searchValue, function(err, replay) {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve({
                "searchKey": replay[1],
                "cursor": replay[0]
            });
        });
    });

};

function removeArrayData(array, element) {
    var index = array.indexOf(element);
    if (index >= 0) {
        array.splice(index, 1); //deleting the attendance and making it marked
        return array;
    } else {
        return array;
    }
}

function readEmployeeSnapshot(callback) {
    var ref = firebase.database().ref("employee");
    ref.once("value", function(data) {
        var temp = {};
        var data = data.val();
        for (var key in data) {
            var tempObj = {};
            tempObj.employeeName = data[key].personal.employeeName;
            tempObj.employeeStatus = data[key].hrData.employeeStatus; //"Fellowship";//data[key].
            tempObj.company = data[key].hrData.company; //"BridgeLabz";
            tempObj.mobile = data[key].personal.mobile;
            tempObj.emailId = data[key].personal.emailId;
            tempObj.blStartDate = data[key].hrData.blStartDate;
            tempObj.companyJoinDate = data[key].hrData.companyJoinDate;
            tempObj.companyLeaveDate = data[key].hrData.companyLeaveDate;
            tempObj.leaveTaken = 0;
            temp[key] = JSON.stringify(tempObj);
        }
        callback(temp);
    });
}
