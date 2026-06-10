// models/booking.js

const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    houseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Home",
        required: true
    }
});

module.exports = mongoose.model("Booking", bookingSchema);