//external module
const express = require('express');
const hostRouter = express.Router();

//local module
const hostcontroller = require("../controllers/hostcontroller");
 

hostRouter.get("/host/add-home", hostcontroller.getAddHome)
hostRouter.post("/host/add-home",hostcontroller.postAddhome)
hostRouter.get("/host/homelist", hostcontroller.getHostHomes);
hostRouter.get("/host/edit-home/:homeId", hostcontroller.getEditHome);
hostRouter.post("/edit-home", hostcontroller.postEditHome);
hostRouter.post("/host/delete-home/:homeId", hostcontroller.postDeleteHome)

exports.hostRouter = hostRouter;

