var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");

router.get("/", function(req, res) {
    try {
        var timeStamp = req.query.timeStamp,
            date = commonMethod.getMonthTimeStamp(timeStamp),
            days = commonMethod.monthDays(timeStamp);
        commonMethod.verifyToken(req.header("x-token")); //Authentcating users token
        if (timeStamp === undefined || timeStamp === null || timeStamp === '') {
            throw 400;
        }

        deriveDataEvent.readLeaveEmployee(date, days).then(function(data) {
            deriveDataEvent.readEmployeeSnapshot(data).then(function(employee) {
                res.send({
                    timeStamp,
                    "leaveOutEmployee": employee.employeeSnapshot,
                    "employeeLeave": employee.employeeSnapshot.length,
                    "totalEmployee": employee.totalEmployee
                });
            });
        });

    } catch (e) {
        if (e === 400)
            res.status(400).send("Bad Request Parameter");
        else
            res.status(304).send("Bad Parameter");
    }
});

module.exports = router;
