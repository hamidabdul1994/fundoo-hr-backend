var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");

router.put("/", function(req, res) {
    try {
        var tempData = req.body;
        var obj = {};
        var keys = ["accountNumber", "bankName", "ifscCode", "pan", "paySalary", "reason"];
        commonMethod.verifyToken(req.header("x-token"));      //Authentcating users token
        keys.forEach(function(k) {
            if (tempData[k] === undefined || tempData[k] === null || tempData[k] === '') {
                throw 400;
            } else {
                obj[k] = tempData[k];
            }
        });


        commonMethod.updateEmployeeData(tempData.engineerId, "bank", obj).then(function() {
            res.send({
                "token": tempData.token,
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
