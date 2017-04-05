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
app.use("/updateEmployeeDetails", require("./updateEmployee"));
app.use("/readLeaveEmployee", require("./readLeaveEmployee"));
app.use("/readFalloutAttendanceEmployee", require("./readFalloutAttendanceEmployee"));
app.use("/readUnmarkedAttendanceEmployee", require("./readUnmarkedAttendanceEmployee"));
app.use("/readMonthlyAttendanceSummary", require("./readMonthlyAttendanceSummary"));
app.use("/readDashboardData", require("./readDashboardData"));

app.use("/sendEmailToEmployee", require("./sendEmailToEmployee"));

app.use("/readAllEmployee", require("./readAllEmployee"));
app.use("/readInternEmployee", require("./readInternEmployee"));
app.use("/downloadSalaryReport", require("./downloadSalaryReport"));
app.use("/downloadAttendanceReport", require("./downloadAttendanceReport"));
app.use("/downloadInvoiceReport", require("./downloadInvoiceReport"));

app.post("/dummy", function (req, res) {

    var data = {};
    data.engineerId = req.body.engineerId;
    data.company = req.body.company;
    data.employeeName = req.body.employeeName;
    data.city = req.body.city;
    deriveDataEvent.dummy(JSON.stringify(data)).then(function (setData) {
        res.send(setData);
    })
});


app.get("/searchEmployee/:searchKey/:cursor", function (req, res) {

    var temp = "*" + req.params.searchKey + "*";
    var cursor = req.params.cursor || "0";
    deriveDataEvent.searchDummy(temp, cursor).then(function (data) {
        var tempData = data.searchKey.map(function (itm) {
            return JSON.parse(itm);
        });
        res.send({
            "searchValue": tempData,
            "cursor": data.cursor
        });
    })
});


module.exports = app;
