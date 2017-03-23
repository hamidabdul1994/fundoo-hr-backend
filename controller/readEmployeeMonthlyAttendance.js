var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");
/**  **/
router.get("/",function(req,res){

  try {
    var token = req.query.token,
        engineerId = req.query.engineerId,
        timeStamp = req.query.timeStamp,
        date = commonMethod.getMonthTimeStamp(timeStamp),
        time = date.split("/"),
        today = commonMethod.getMonthTimeStamp(Date.now()).split("/");
        commonMethod.verifyToken(req.header("x-token"));      //Authentcating users token
        var tempData = req.query;
        var keys =["engineerId","timeStamp"];
        keys.forEach(function (k) {
          if(tempData[k]===undefined || tempData[k]===null || tempData[k]=== ''){
            throw 400;
          }
        });

        if(time[0]<today[0] || (time[0]<=today[0] && commonMethod.month.indexOf(time[1])<=commonMethod.month.indexOf(today[1]))){
        commonMethod.readEmployeeAttendance(engineerId,date).then(function(data){
          var tempObj={token};
          tempObj.attendanceData=data;
          deriveDataEvent.employeeSnapshot(tempObj,engineerId);
          deriveDataEvent.once("employeeSnapshot",function(obj){
            res.send(obj);
          });
        }).catch(function(){
              res.status(404).send("user is not available or no Attendance entry");
        });
      }else {
        res.status(404).send("No Attendance entry for ::"+date);
      }

  } catch (e) {
    if(e===400)
    res.status(400).send("Bad Request Parameter");
    else
    res.status(401).send("invalid token");
  }
});

module.exports=router;
