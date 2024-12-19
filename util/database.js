// // util/database.js
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = callback => {
    MongoClient.connect(
      "mongodb+srv://chaibaDev:chaiba123@chaiba.7iycd.mongodb.net/?retryWrites=true&w=majority&appName=chaiba",
      {
        serverSelectionTimeoutMS: 1000, // 30 seconds timeout
      }
    )
      .then((client) => {
        console.log("Connected to MongoDB!");
        _db = client.db("Shop"); // Make sure the 'Shop' database exists in your MongoDB cluster
        callback(client);
      })
      .catch((err) => {
        console.log("Failed to connect");
      });
};

function getDB() {
    if (_db) {
        return _db;
    } else {
        throw "No database found!";  
    }
};


exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
