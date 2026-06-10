
const favourite = require("../models/favourite");
const Favourite = require("../models/favourite");
const Home = require("../models/home");
const Booking = require("../models/booking");

exports.getHomes = (req, res, next) => {
     Home.find().then(registerdHomes =>
          res.render('store/home', {
               registerdHomes,
               pagetitle: 'airbnb Home',
               isLoggedIn: req.session.isLoggedIn,
          })
     );

};


exports.postAddtoFavourite = (req, res, next) => {
     const homeId = req.body.id;
     favourite.findOne({ houseId: homeId }).then((fav) => {
          if (fav) {
               console.log("already marked as favourite");
          } else {
               fav = new Favourite({ houseId: homeId });
               fav.save().then((result) => {
                    console.log("fav added:", result);
               });
          }
          res.redirect("/favourite")
     }).catch(err => {
          console.log("Error while marking favourite:", err);
     })

}
exports.postRemoveFromFavourite = (req, res, next) => {
     const homeId = req.params.homeId;
     Favourite.findOneAnddeleteById({ houseId: homeId }).then(result => {
          console.log("fav Removed:", result);
     }).catch(err => {
          console.log("error while removeing favourites:", err);
     }).finally(() => {
          res.redirect("/favourite")
     })
}
 

exports.getBookings = (req, res, next) => {

    Booking.find()
        .populate("houseId")
        .then(bookings => {

            const bookedHomes =
                bookings.map(booking => booking.houseId);

            res.render("store/bookings", {
                bookedHomes,
                pagetitle: "My Bookings",
                isLoggedIn: req.session.isLoggedIn,
            });

        })
        .catch(err => console.log(err));
};
exports.getfavouritelist = (req, res, next) => {
     favourite.find()
          .populate('houseId')
          .then((favourites) => {
               const favouriteHomes = favourites.map((fav) => fav.houseId);
               res.render("store/favourite-list", {
                    favouriteHomes: favouriteHomes,
                    pagetitle: "my favourite",
                    isLoggedIn: req.session.isLoggedIn,
               })
          })

}



exports.getindex = (req, res, next) => {
     res.render('store/index', {
          pagetitle: 'index-page',
          isLoggedIn: req.session.isLoggedIn,
     })

}
exports.gethomedetails = (req, res, next) => {
     const homeId = req.params.homeId;
     console.log("At home details page", homeId);
     Home.findById(homeId).then(home => {
          if (!home) {
               return res.redirect("/");
          }

          res.render('store/home-details', {
               home:home,
               pagetitle: 'home Details',
               isLoggedIn: req.session.isLoggedIn,
          });
     });



}
exports.postAddBooking = (req, res, next) => {

     const homeId = req.body.homeId;

     const booking = new Booking({
          houseId: homeId
     });

     booking.save()
          .then(() => {
               res.redirect("/bookings");
          })
          .catch(err => console.log(err));
};

exports.postRemoveBooking = (req, res, next) => {

    const homeId = req.params.homeId;

    Booking.findOneAndDelete({
        houseId: homeId
    })
    .then(() => {
        res.redirect("/bookings");
    })
    .catch(err => {
        console.log(err);
    });
};
 