const path = require('path');
const env =require("dotenv").config();
const express = require('express');
const session =require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const DB_PATH = process.env.MONGODB_URI;
 

//local modul
const storeRouter = require('./routes/storeRouter');
const { hostRouter } = require('./routes/HostRouter');
const authRouter = require("./routes/authRouter")
const rootDir = require("./utils/pathUtils")
const errorsControllers = require("./controllers/errors");
const { default: mongoose } = require('mongoose');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
    uri: DB_PATH,
    collection: 'sessions'
})


app.use(express.urlencoded());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:true,
    store : store
}))

app.use((req, res, next)=>{
     req.session.isLoggedIn =req.session.isLoggedIn;
    next()
})
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.user = req.session.user;
    next();
});





app.use(storeRouter);
app.use("/host", (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect("/login");
    }
});
app.use(hostRouter);
app.use(authRouter);


app.use(express.static(path.join(rootDir, 'public')))



app.use(errorsControllers.pageNotFound);





const PORT = 3000;

mongoose.connect(DB_PATH).then(() => {
    console.log('database is connected succussFully');
    app.listen(PORT, () => {
        console.log(`Server running on address http://localhost:${PORT}`)
    })

}).catch(err => {
    console.log("Error while coneecting to Mongo", err)
})

