var Express = require('express');
var router = Express.Router();
var commonMethod = require("../common/commonMethod");

router.put("/:requiredData", function(request, response) {
    try {
        var updateData = request.body;
        response.send({
            "userWantToUpdate": request.params,
            "updateData": updateData
        });
    } catch (e) {
        if (e === 400)
            response.status(400).send("Bad Request Parameter");
        else
            response.status(401).send("invalid token");
    }

});

module.exports = router;
