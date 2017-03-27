var Express = require('express');
var router = Express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");

router.get("/:requiredData",function(request,response){
  try {
    response.send({"userWant":request.params});
} catch (e) {
  if(e===400)
  res.status(400).send("Bad Request Parameter");
  else
  res.status(401).send("invalid token or set token Header in");
}
});

module.exports=router;
