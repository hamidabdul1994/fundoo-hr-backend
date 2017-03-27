var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
/**  **/
router.get("/",function(req,res){
try {
  var token = req.query.token,
      engineerId = req.query.engineerId,
      timeStamp = req.query.timeStamp,
      date = commonMethod.getFullTimeStamp(timeStamp);

      commonMethod.verifyToken(req.header("x-token"));      //Authentcating users token
      var tempData = req.query;
      var keys =["engineerId","timeStamp"];
      keys.forEach(function (k) {
        if(tempData[k]===undefined || tempData[k]===null || tempData[k]=== ''){
          throw 400;
        }
      });
      commonMethod.readEmployeeAttendance(engineerId,date).then(function(data){
        data.token=token;
        data.timeStamp=timeStamp;
        data.engineerId=engineerId;
        res.send(data);
      }).catch(function(){
            res.status(404).send("user is not available or no Attendance entry");
      });

    } catch (e) {
      if(e===400)
      res.status(400).send("Bad Request Parameter");
      else
      res.status(401).send("invalid token");
    }
});


  module.exports=router;
