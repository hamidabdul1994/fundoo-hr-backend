var express = require('express');
var app = express.Router();

var deriveDataEvent = require("../common/events");

app.use("/userValidate", require("./userValidate"));
app.use("/login", require("./login"));
app.use("/signup", require("./signup"));
app.use("/readEmployeeMonthlyAttendance", require("./readEmployeeMonthlyAttendance"));
app.use("/readEmployeeDayAttendance", require("./readEmployeeDayAttendance"));
app.use("/createEmployeeDayAttendance", require("./createEmployeeDayAttendance"));
app.use("/searchEmployeeByName", require("./searchEmployeeByName"));

app.use("/readEmployeeDetails", require("./readEmployee"));
/*
app.use("/readEmployeeHRData", require("./readEmployeeHRData"));
app.use("/readEmployeePersonalData", require("./readEmployeePersonalData"));
app.use("/readEmployeeProfileData", require("./readEmployeeProfileData"));
app.use("/readEmployeeBankData", require("./readEmployeeBankData"));
app.use("/readEmployeeTrackingData", require("./readEmployeeTrackingData"));
*/
app.use("/updateEmployeeDetails", require("./updateEmployee"));
/*
app.use("/updateEmployeeHRData", require("./updateEmployeeHRData"));
app.use("/updateEmployeePersonalData", require("./updateEmployeePersonalData"));
app.use("/updateEmployeeProfileData", require("./updateEmployeeProfileData"));
app.use("/updateEmployeeTrackingData", require("./updateEmployeeTrackingData"));
app.use("/updateEmployeeBankData", require("./updateEmployeeBankData"));
*/
app.use("/readLeaveEmployee", require("./readLeaveEmployee"));
app.use("/readFalloutAttendanceEmployee", require("./readFalloutAttendanceEmployee"));
app.use("/readUnmarkedAttendanceEmployee", require("./readUnmarkedAttendanceEmployee"));
app.use("/readMonthlyAttendanceSummary", require("./readMonthlyAttendanceSummary"));
app.use("/readDashboardData", require("./readDashboardData"));

app.use("/sendEmailToUnmarkedEmployee", require("./sendEmailToUnmarkedEmployee"));
app.use("/sendEmailToFalloutEmployee", require("./sendEmailToFalloutEmployee"));
app.use("/sendEmailToLeaveEmployee", require("./sendEmailToLeaveEmployee"));

app.use("/readAllEmployee", require("./readAllEmployee"));
app.use("/readInternEmployee", require("./readInternEmployee"));
app.use("/downloadSalaryReport", require("./downloadSalaryReport"));
app.use("/downloadAttendanceReport", require("./downloadAttendanceReport"));
app.use("/downloadInvoiceReport", require("./downloadInvoiceReport"));

app.post("/dummy", function(req, res) {

    var data = {};
    data.engineerId = req.body.engineerId;
    data.company = req.body.company;
    data.employeeName = req.body.employeeName;
    data.city = req.body.city;
    deriveDataEvent.dummy(JSON.stringify(data)).then(function(setData) {
        res.send(setData);
    })
});


app.get("/searchEmployee/:searchKey/:cursor", function(req, res) {

    var temp = "*" + req.params.searchKey + "*";
    var cursor = req.params.cursor || "0";
    deriveDataEvent.searchDummy(temp, cursor).then(function(data) {
        var tempData = data.searchKey.map(function(itm) {
            return JSON.parse(itm);
        });
        res.send({
            "searchValue": tempData,
            "cursor": data.cursor
        });
    })
});


module.exports = app;
