var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");

router.get("/", function(req, res) {
    try {
        var today = commonMethod.getFullTimeStamp(),
            timeStamp = Number.parseInt(req.query.timeStamp),
            date,
            obj = {},
            monthAttendance = [],
            totalEmployee,
            falloutEmployee,
            leave,
            unmarked;
        timeStamp -= 86400000; //Giving 1 day back data
        date = commonMethod.getFullTimeStamp(timeStamp);
        time = date.split("/");
        today = today.split("/");
        commonMethod.verifyToken(req.header("x-token")); //Authentcating users token

        var tempData = req.query.timeStamp;

        if (tempData === undefined || tempData === null || tempData === '') {
            throw 400;
        }

        // if(time[0]<=new Date().getFullYear() && time[1]<=new Date().getMonth()){
        commonMethod.verifyToken(req.header("x-token"));

        deriveDataEvent.readTotalEmployee();
        deriveDataEvent.on("totalEmployee", function(data) {
            totalEmployee = data;
        });

        var promise1 = deriveDataEvent.readEmployeeUnmarkedAttendance(date, 1).then(function(data) {
            unmarked = data.unmarked;
        });
        date = commonMethod.getMonthTimeStamp(timeStamp),
            days = commonMethod.monthDays(timeStamp),
            time = date.split("/");
        if (time[0] < today[0] ||
            (time[0] <= today[0] &&
                commonMethod.month.indexOf(time[1]) <= commonMethod.month.indexOf(today[1])
            )) {
            var promise2 = deriveDataEvent.readFalloutEmployee(date, days).then(function(data) {
                falloutEmployee = data.length;
            });
            var promise3 = deriveDataEvent.readLeaveEmployee(date, days).then(function(data) {
                leave = "" + data.length;
            })
            Promise.all([promise1, promise2]).then(function() {
                res.send({
                    timeStamp,
                    "attendanceSummary": {
                        "marked": totalEmployee - unmarked,
                        unmarked
                    },
                    'attendanceFallout': {
                        falloutEmployee,
                        totalEmployee
                    },
                    'leaveSummary': {
                        leave
                    }
                });
            });
        } else {
            res.status(404).send("No entry for ::" + date);
        }
    } catch (e) {
        if (e === 400)
            res.status(400).send("Bad Request Parameter");
        else
            res.status(401).send("invalid token");
    }
});

module.exports = router;
