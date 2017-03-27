var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");

router.get("/", function(req, res) {
    try {
        var today = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate(),
            timeStamp = req.query.timeStamp,
            date = commonMethod.getFullTimeStamp(timeStamp),
            obj = {},
            monthAttendance = [],
            totalEmployee;
            commonMethod.verifyToken(req.header("x-token"));      //Authentcating users token

            if(timeStamp===undefined || timeStamp===null || timeStamp=== ''){
              throw 400;
            }

        deriveDataEvent.readTotalEmployee();
        deriveDataEvent.once("totalEmployee", function(data) {
            totalEmployee = data;
        });
        var tSplit = today.split("/");
        var dSplit = date.split("/");
        for (var i = 1; i <= commonMethod.monthDays(timeStamp); i++) {
            if (((tSplit[0] === dSplit[0] && tSplit[1] === commonMethod.month.indexOf(dSplit[1])) && tSplit[2] <= i )|| commonMethod.isSunday(dSplit[0],dSplit[1],i)) {
                monthAttendance.push({
                    "day": i,
                    "unmarked": "-"
                });
            } else {
                var promise = deriveDataEvent.readEmployeeUnmarkedAttendance(dSplit[0] + "/" + dSplit[1] + "/" + i, i).then(function(data) {
                    monthAttendance.push(data);
                });
            }
        }
        Promise.all([promise]).then(function() {
            res.send({
                timeStamp,
                "attendance": monthAttendance,
                totalEmployee
            });
        });

    } catch (e) {
      if(e===400)
      res.status(400).send("Bad Request Parameter");
      else
      res.status(401).send("Bad Parameter or invalid token");
    }
});

module.exports = router;
