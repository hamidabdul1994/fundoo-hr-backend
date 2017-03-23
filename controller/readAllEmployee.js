var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");

router.get("/", function(req, res) {
    try {
      /*Here we need to call Firebase calling which will fetch intership employee , who are working with tech company*/
      commonMethod.verifyToken(req.header("x-token"));      //Authentcating users token
      commonMethod.readJSON("./data/allEmployee.json").then(function (data) {
        res.send({"allEmployee":JSON.parse(data)})
      });

    } catch (e) {
      console.log(e);
        res.status(401).send("Bad Parameter or invalid token");
    }
});

module.exports = router;
