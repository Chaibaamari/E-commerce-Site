
const getDB = require('../util/database').getDB
const mongodb = require('mongodb')
// const mongoConnect = require('../util/database').mongoConnect

module.exports = class Product{

    constructor(title, price, description, imageUrl , id , userId) {
        this.title = title; 
        this.price = price;  
        this.description = description;
        this.imageUrl = imageUrl; 
        this._id = id;
        this.userId = userId; // null or the id of the user
    }

    save() {
        const db = getDB();
        let dbOps;
        if (this._id) {
            console.log('start')
            const updatedData = { ...this };
            delete updatedData._id;
            dbOps = db 
                .collection("products")
                .updateOne(
                    { _id: new mongodb.ObjectId(this._id) },
                    { $set: updatedData }
                );
        } else {
            dbOps = db.collection("products").insertOne(this);
        } 
        return( dbOps
            .then((result) => { console.log(result) })
            .catch((err) => { console.log(err) }) 
    )} 

    static fetchAll() {
        const db = getDB();
        return db.collection('products').find().toArray().then((products) => {
            return products
        }).catch(() => {
            console.log('err chaiba')
        }); 
    }

    static fetchAllProducts(id) {
        const db = getDB();
        return db.collection('products').find({userId : new mongodb.ObjectId(id)}).toArray().then((products) => {
            return products
        }).catch(() => {
            console.log('err chaiba')
        }); 
    }

    static findById(Id) {
        const db = getDB()
        return db.collection('products').find({ _id: new mongodb.ObjectId(Id) }).next().then((product) => {
            return product
        }).catch(() => {
            console.log("err chaiba");
        })
    }

    static findByIdAdmin(Id) {
        const db = getDB()
        return db.collection('products').find({ userId: new mongodb.ObjectId(Id) }).next().then((product) => {
            return product
        }).catch(() => {
            console.log("err chaiba");
        })
    }

    // static SelectId(Id) {
    // return db.execute('SELECT * FROM Products WHERE Products.Id = ? ' , [Id])
    // }

    static DeleteProductID(Id) {
        const db = getDB();
        return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(Id) })
            .then(() => {
                console.log('has deleted')
            })
            .catch(() => {
                console.log('not deleted')
            })
    } 
}