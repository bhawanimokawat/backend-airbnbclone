const mongo = require('mongodb');

const MongoClient =mongo.MongoClient;

const MONGO_URL ="mongodb+srv://bhawanimokawat599_db_user:MZ5vN74JoabXY0tB@airbnbcluster.nxfeu06.mongodb.net/?appName=AirbnbCluster";

let _db;
 const mongoConnect = (callback) =>{
    MongoClient.connect(MONGO_URL).then(client => {
        //console.log(client);
        callback(client);
            _db =client.db('airbnb');
    }).catch(err =>{
        console.log('Error while connecting to mongo:',err);
    })
 }

 const getDB = () =>{
    if(!_db) {
        throw new Error('Mongo not connected');
    }
    return _db;
 }
 exports.mongoConnect =mongoConnect;
 exports.getDB =getDB;
