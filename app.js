// app.js
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ErrorController = require("./controllers/Error");
const { mongoConnect } = require("./util/database");
const User = require('./models/User');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require('csurf')
const flash =  require('connect-flash')
const app = express();

const MONGODB_URI =
    "mongodb+srv://chaibaDev:chaiba123@chaiba.7iycd.mongodb.net/Shop";
app.set("view engine", "ejs");
app.set("views", "views");
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection : 'sessions',
});
// Handle errors in MongoDB store
store.on("error", (error) => {
    console.error("Session store error:", error);
});
const csrfProtection = csrf()

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop"); 
const Login = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));   
app.use(express.static(path.join(__dirname, "public")));    
app.use(
    session({
        secret: "my secret",  
        resave: false,
        saveUninitialized: false, 
        store: store, 
    })
);
app.use(csrfProtection);
// here all the route has this variable 
app.use(flash())
app.use((req, res, next) => {
    res.locals.LoggedIn = req.session.LoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next()
});

app.use((req, res, next) => {
    if (!req.session.userB) {
        return next()  
    }
    User.findUser(req.session.userB._id).then(userB => { 
        req.userB = new User(
            userB.email,
            userB.Password, 
            userB.cart,
            userB._id
        );
        console.log(req.userB)
        next()
    }).catch(() => {
        console.log('error ocurred')  
    })
})
app.use("/admin", adminRoutes); 
app.use(shopRoutes);
app.use(Login);

app.use(ErrorController.PageNotFound); 

mongoConnect((client) => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
        })
});