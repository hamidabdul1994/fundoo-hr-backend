var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");

router.post("/", function(req, res) {
    try {
        var tempData = req.body;
        var temp = {};
        var keys = ["attendanceStatus","markedStatus","punchIn","punchOut","reason"];
        keys.forEach(function (k) {
          if(tempData[k]===undefined || tempData[k]===null || tempData[k]=== ''){
            throw 400;
          }else {
            temp[k]=tempData[k];
          }
        });
        commonMethod.verifyToken(req.header("x-token"));      //Authentcating users token

        var date = commonMethod.getFullTimeStamp(tempData.timeStamp);
        if (temp.attendanceStatus === "Leave") {
            deriveDataEvent.createEmployeeLeave(tempData.engineerId,date);
        }

        commonMethod.createEmployeeAttendance(tempData.engineerId, date, temp).then(function() {
            deriveDataEvent.creatEmployeeUnmarkedAttendance(tempData.engineerId, date);
            res.send({
                token: tempData.token,
                engineerId: tempData.engineerId,
                timeStamp: tempData.timeStamp,
                status: 200,
                message: "Successfully Added"
            });
        }).catch(function(e) {
            res.status(404).send("No User Vailable with enigeneer Id");
        });

    } catch (e) {
      if(e===400)
      res.status(400).send("Bad Request Parameter");
      else
      res.status(401).send(" invalid token");

    }

});

module.exports = router;
