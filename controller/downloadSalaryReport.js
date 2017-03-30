var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");
var json2csv = require('json2csv');

router.post("/", function(req, res) {
    try {
        var selectedEngineer = req.body.selectedEngineer;
        commonMethod.verifyToken(req.header("x-token")); //Authentcating users token
        var fieldNames = ['Engineer ID', 'Emplyee Name', 'Account Number', ' Bank Name ', 'IFSC code', 'Pay Salary'];

        var fields = ['engineerId', 'emplyeeName', 'accountNumber', 'bankName', 'ifscCode', 'paySalary'];

        var data = [];
        selectedEngineer.forEach(function(key, value) {
            var temp = {
                "engineerId": "427188EI",
                "emplyeeName": "Abhishek Ganguly",
                "accountNumber": "1234657998",
                "bankName": "SBI",
                "ifscCode": "SBI00027",
                "paySalary": "Yes"
            };
            temp.engineerId = key;
            data.push(temp);
        });
        var csvData = json2csv({
            data,
            fields,
            fieldNames
        });
        res.setHeader('Content-disposition', 'attachment; filename=salaryReport.csv');
        res.set('Content-Type', 'text/csv');
        res.header("Access-Control-Expose-Headers", "Content-Disposition");
        res.send(csvData);
    } catch (e) {
        res.status(401).send("Bad Parameter or invalid token");
    }
});

module.exports = router;
