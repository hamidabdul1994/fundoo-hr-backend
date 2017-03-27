var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var employeeSnapshotEvent = require("../common/events");

router.put("/", function(req, res) {
    try {
        var temp = req.body;
        var obj = {};
        var keys = ["employeeName", "emailId", "mobile", "dateOfBirth", "fatherName", "fatherMobile", "occupation", "annualSalary", "mumbaiAddress", "permenantAddress"];
        keys.forEach(function(k) {
            if (temp[k] === undefined || temp[k] === null || temp[k] === '') {
                throw 400;
            } else {
                obj[k] = temp[k];
            }
        });
        commonMethod.updateEmployeeData(temp.engineerId, "personal", obj).then(function() {
            employeeSnapshotEvent.updateEmployeePersonalSnapshot(temp.engineerId, obj);
            res.send({
                "token": temp.token,
                "status": 200,
                "message": "Successfully Updated"
            });
        }).catch(data => {
            res.status(404).send("User Not Found")
        });
    } catch (e) {
        if (e === 400)
            res.status(400).send("Bad Request Parameter");
        else
            res.status(401).send("invalid token");

    }

});

module.exports = router;
