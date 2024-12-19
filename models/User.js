const getDB = require('../util/database').getDB
const mongodb  = require('mongodb')

class User{
    constructor(email, password , cart , id) {
        this.email = email;
        this.Password = password
        this.cart = cart;
        this._id = id;
        this.token = null
        this.tokenExpirationTime = 0;
    }

    save() {
        const db = getDB()
        return db.collection('users').insertOne(this)
            .then((product) => {
                console.log('user created')
            })
            .catch(() => {
                console.log('error of creating user')
            })
    }

    saveUpdate() {
    const db = getDB();
        return db.collection('users').updateOne( 
            { _id: this._id }, 
            {
                $set: {
                    email: this.email,
                    Password: this.Password, 
                    cart: this.cart,
                    token: this.token,  
                    tokenExpirationTime: this.tokenExpirationTime 
                }
            },
        )
            .then((result) => {
                console.log('User updated');
            })
            .catch((err) => {
                console.log('Error updating user', err);
            });
}

    AddToCart(product) {
        const db = getDB();
        const productIndex = this.cart.products.findIndex((p) => {
            return p.productID.toString() === product._id.toString(); // not working
        });
        let NewQuantity = 1
        const updateCartItems = [...this.cart.products];
        let priceItem = +this.cart.price
        if (productIndex !== -1) {//faire un update de mongodb
            NewQuantity = updateCartItems[productIndex].quantity + 1;
            updateCartItems[productIndex].quantity = NewQuantity;
        } else {
            updateCartItems.push({
                productID: new mongodb.ObjectId(product._id),
                quantity: 1,
            });
        }
        const ProductPrice = +product.price;
        priceItem = priceItem + ProductPrice;

        const cartUser = {
            products: updateCartItems,
            price: +priceItem,
        };
        
        return db
            .collection("users")
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: cartUser } }
            ) 
            .then((result) => {
                console.log("Cart updated successfully:", result);
                return result; // Return the result to confirm the operation succeeded
            })
            .catch((error) => {
                console.error("Error updating cart:", error);
                throw error; // Rethrow the error to handle it in the calling code
            });
    }

    getCart() {
        const productsIds = this.cart.products.map((p) => {
            return p.productID;
        });
        const db = getDB()
        return db.collection("products").find({ _id: { $in: productsIds } }).toArray()
            .then((products) => {
                console.log(products) 
                return products.map((p) => {
                    return {
                        ...p, quantity: this.cart.products.find((i) => {
                        return i.productID.toString() == p._id.toString()
                        }).quantity}
                })
            })
    }

    getPrice() {
        return this.cart.price
    }
    getIdPrice(productID) {
    const db = getDB();

    // Ensure Item is correctly defined and has the productID
    if (!productID) {
        console.error("Invalid Item passed to getIdPrice.");
        return Promise.reject("Invalid Item passed.");
    }

    // Use findOne to get a single product by its ID
    return db.collection('products')
        .findOne({ _id: new mongodb.ObjectId(productID) }) 
        .then((product) => {
            if (!product) {
                console.error("Product not found.");
                return Promise.reject("Product not found.");
            }

            // Assuming you want to return the price or other details
            return product
        })
        .catch((err) => {
            console.error("Error fetching product from database:", err);
            return Promise.reject(err);
        });
}


    async deleteCartItem(ProductCartItem  , quantity) {
        const itemToDelete = this.cart.products.filter((item) => {
            return item.productID.toString() == ProductCartItem.toString()
        });

        if (!itemToDelete) {
            console.log('Invalid Item To Delete')
        }

        console.log(itemToDelete[0].productID.toString());
        const UpdatedCartItems = this.cart.products.filter((item) => {
            return item.productID.toString() !== ProductCartItem.toString()     
        });
        
        console.log(UpdatedCartItems)
        
        const db = getDB();
        const ItemProducteDec = await this.getIdPrice(itemToDelete[0].productID.toString()) 
        const UpdateTotalPrice =
          this.cart.price - (ItemProducteDec.price * quantity).toFixed(2);  
        console.log("UpdateTotalPrice" + UpdateTotalPrice);   
        return db
            .collection('users')
            .updateOne({ _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: { products: UpdatedCartItems , price: UpdateTotalPrice  }}
})
    }
    
    static findUser(userId) {
        const db = getDB();
        return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) }).then((user) => {
            return user;
        }).catch(error => {
            console.log('Error occurred while finding user:', error);
            throw error; // Re-throw the error to ensure it can be handled in the middleware
        });
    }
    static async findUserEmail(email) {
        const db = getDB();
        const user = await db.collection('users').findOne({ email: email })
        return user
    }

    static async findUserByToken(token) {
        const db = getDB();
        const user = await db.collection("users").findOne({ token: token });
        return user;
    }
}

module.exports = User;