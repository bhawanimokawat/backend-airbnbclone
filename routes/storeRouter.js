const path = require('path');
const express = require('express');
const storeRouter = express.Router();

//local module

const { registerdHomes } = require('./HostRouter');
const getHomecontrollers = require("../controllers/storecontroller")

storeRouter.get("/", getHomecontrollers.getHomes);
storeRouter.get("/bookings", getHomecontrollers.getBookings)
storeRouter.get("/favourite", getHomecontrollers.getfavouritelist)
storeRouter.get("/index", getHomecontrollers.getindex)
storeRouter.get("/homes/:homeId", getHomecontrollers.gethomedetails)
storeRouter.post("/favourite", getHomecontrollers.postAddtoFavourite)
storeRouter.post("/favourites/delete/:homeId", getHomecontrollers.postRemoveFromFavourite);
storeRouter.post("/bookings/add", getHomecontrollers.postAddBooking);
storeRouter.post(
    "/bookings/delete/:homeId",
    getHomecontrollers.postRemoveBooking
);

module.exports = storeRouter;