var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");
//var nodemailer = require('nodemailer');

router.post("/", function(req, res) {
    try {
        var temp = req.body;
        var timeStamp = temp.timeStamp;
        var date = commonMethod.getMonthTimeStamp(timeStamp);
        commonMethod.verifyToken(req.header("x-token"));      //Authentcating users token
        if(timeStamp===undefined || timeStamp===null || timeStamp=== ''){
          throw 400;
        }

        days = commonMethod.monthDays(timeStamp);
        var promise =  deriveDataEvent.readFalloutEmployee(date,days).then(function(data){
            deriveDataEvent.readEmployeeSnapshot(data).then(function(engineerData){
            engineerData.employeeSnapshot.forEach(function(engineerData){
            sendMailTo(engineerData.emailId,engineerData.employeeName,date);
            });
          });
        });
        /**  waitinf for promise is execute complete or not  **/
         Promise.all([promise]).then(function() {
           res.send({
               timeStamp,
               'status': 200,
               'message': 'Successfully sent mail to users'
           });
        });
        //sendMailTo()
    } catch (e) {
      if(e===400)
      res.status(400).send("Bad Request Parameter");
      else
      res.status(401).send("Bad Parameter or invalid token");
    }
});

module.exports = router;


function sendMailTo(emailId,employeeName,date) {
  new Promise(function(resolve, reject) {

  var mailOptions = {
      from: '"BridgeLabz Admin" <fundoohr2016@gmail.com>', // sender address
      to: emailId, // list of receivers'hamidabdul1994@gmail.com'
      subject: 'Regarding Attendance Fallout ', // Subject line
      // text: 'Hello world ', // plaintext body
      html: '<b>Hello '+employeeName+'!</b><br/><p>It is to bring to your kind notice That you have failed to mark your attendance for three and more than three days in a month '+date+'.Please do so immediately </p><br/>Mark Attendance using <a href="http://localhost/fundooHr">http://localhost/fundooHr</a><br/>\
      If you have any queries please contact admin using the given link :<a href="http://localhost/fundooHrAdmin">http://localhost/fundooHrAdmin</a><br/> Thanking you' // html body
  };

  // send mail with defined transport object
commonMethod.sendEmail(mailOptions).then(data=>{resolve()});
  });
}
