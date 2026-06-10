const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
    res.render('host/edithome', {
        pageTilte: 'Add home',
        editing: false,
        isLoggedIn: req.session.isLoggedIn,
    });
};
exports.getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    const editing = req.query.editing === 'true';

    Home.findById(homeId).then(home => {
        if (!home) {
            console.log("home not found for editing");
            return res.redirect("/host/hosthomelist");
        }
        console.log(homeId, editing,home);
        home:home,
        res.render('host/edithome', {
            pageTilte: 'edit your home',
            editing: editing,
            home: home,
            isLoggedIn: req.session.isLoggedIn,
        });
    })

};

exports.getHostHomes = (req, res, next) => {
    Home.find().then(registerdHomes =>
        res.render('host/hosthomelist', {
            registerdHomes,
            pagetitle: 'home-list',
            isLoggedIn: req.session.isLoggedIn,
        })
    )

};


exports.postAddhome = (req, res, next) => {
    console.log(req.body);

    const { houseName, price, rating, location, image } = req.body;

    const home = new Home({
        houseName,
        price,
        rating,
        location,
        image
});

    home.save().then(()=>{
        console.log('home saves succesFully');
    });

    res.render('host/homeAddsuccus', {
        pageTilte: 'Add home Successfully',
        isLoggedIn: req.session.isLoggedIn,
    });
};


exports.postEditHome = (req, res, next) => {
    const { id, houseName, price, rating, location, image } = req.body;

    Home.findById(id).then((home) =>{
       home.houseName =houseName;
       home.price =price;
       home.location =location;
       home.rating=rating;
       home.image =image;
       home.save().then((result) =>{
          console.log("home upadted", result);
       }).catch(err =>{
        console.log('error while updating',err);
       })
         res.redirect('/host/homelist');
    }).catch(err=>{
        console.log("error while finding home",err);
    })
    
};


exports.postDeleteHome = (req, res, next) => {
    const homeId = req.params.homeId;

    Home.findOneAndDelete({ _id: homeId })
        .then(() => {
            res.redirect("/host/homelist");
        })
        .catch(err => console.log(err));
};
