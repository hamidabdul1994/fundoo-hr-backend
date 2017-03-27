var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");
var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');

router.post("/", function(req, res) {
    try {

        var selectedCompany = req.body.selectedCompany;
        // commonMethod.verifyToken(req.header("x-token"));      //Authentcating users token
        var length = selectedCompany.length;
        var i = 0;
        var fileList = [];

        selectedCompany.forEach(function(value, key) {
            var fieldNames = ['Engineer ID', 'Emplyee Name', 'Month', 'Transfer Date', 'Payment'];

            var fields = ['engineerId', 'emplyeeName', 'salaryMonth', 'transerDate', 'payment'];

            var data = [];
            var selectedEngineer = value.engineerList;

            selectedEngineer.forEach(function(key, value) {
                var temp = {
                    "engineerId": "427188EI",
                    "emplyeeName": "Abhishek Ganguly",
                    "salaryMonth": "January 2017",
                    "transerDate": "2nd Feb 2017",
                    "payment": "1000/-"
                };
                temp.engineerId = key;
                data.push(temp);
            });
            var csvData = json2csv({
                data,
                fields,
                fieldNames
            });
            var fileName = "attendance/" + value.companyName + '_invoice.csv';
            fileList.push({
                "path": fileName,
                "name": path.basename(fileName)
            });
            fs.writeFile(fileName, csvData, function(err) {
                if (err) throw err;
                i++;
                if (i === length) {
                    res.header("Access-Control-Expose-Headers", "Content-Disposition");
                    res.zip(fileList, 'Invoice Report.zip');
                }
            });
        });

    } catch (e) {
        console.log(e);
        res.status(401).send("Bad Parameter or invalid token");
    }
});

module.exports = router;
