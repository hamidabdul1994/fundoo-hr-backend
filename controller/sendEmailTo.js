var express = require('express');
var router = express.Router();
var config = require('../config/static');

router.post("/:sentTo", function(request, response) {
    try {
        var temp = request.body;

        // days = commonMethod.monthDays(timeStamp);
        // var promise =  deriveDataEvent.readFalloutEmployee(date,days).then(function(data){
        //     deriveDataEvent.readEmployeeSnapshot(data).then(function(engineerData){
        //     engineerData.employeeSnapshot.forEach(function(engineerData){
        //     sendMailTo(engineerData.emailId,engineerData.employeeName,date);
        //     });
        //   });
        // });
        /**  waiting for promise is execute complete or not  **/
           response.send({
               timeStamp,
               'status': 200,
               'message': 'Successfully sent mail to users'
           });

    } catch (e) {

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
