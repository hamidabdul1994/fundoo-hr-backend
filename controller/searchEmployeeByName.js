var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");

router.get("/", function(req, res) {
    try {
        // deriveDataEvent.searchEmployee();
        commonMethod.verifyToken(req.header("x-token"));      //Authentcating users token
        //deriveDataEvent.once("employeeList",function(employeeList){
        commonMethod.readJSON("./data/dummy.json").then(function (data) {
          var employeeList = JSON.parse(data);
        if(employeeList.length!==0){
          deriveDataEvent.readEmployeeSnapshot(employeeList).then(function(data){
            //Sorting As per Name
            data.employeeSnapshot.sort(function (a,b) {
              return a.employeeName.charCodeAt(0) - b.employeeName.charCodeAt(0);
            });
            res.send({"employeeList":data.employeeSnapshot});
          });
        }else {
          res.status(404).send("Not Employee available");
        }
        });
    } catch (e) {
      if (e === 400)
          res.status(400).send("Bad Request Parameter");
      else
          res.status(401).send("invalid token");    }
});

module.exports = router;
