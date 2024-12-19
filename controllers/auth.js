const crypto = require('crypto');
const User = require("../models/User"); 
const bcrypt = require('bcryptjs') 
const {validationResult} = require('express-validator')


exports.getLogin = (req, res, next) => {
    // console.log((req.get("Cookie").split('=')[1]) )  
    // const LoggedIn = req.get('Cookie').split('=')[1]
    console.log(req.session.LoggedIn);
    res.render("Login/userlogin", {
        path: "login",
        PageTitle: "LoginPage",
        isAuth: req.session.LoggedIn,
        errorMessage: req.flash('error')[0],
        ErrorInput: [''],
    });
} 
exports.getSignup = (req, res, next) => { 
    res.render("Login/SignUp", {
        path: "/signup",
        PageTitle: "SignUp",
        isAuth: req.session.LoggedIn,
        errorMessage: req.flash('error')[0],
        oldInput: {
                email: '',
                Password: '',
                ConfirmPassword: '',
            },
    });
}

exports.getNewPassword = (req, res, next) => {
    res.render("Login/reset", {
        path: "/reset",
        PageTitle: "resetPassword",
        isAuth: req.session.LoggedIn,
        errorMessage : req.flash('error')[0]
    });
}

exports.getNewPasswordEmail = (req, res, next) => {
    const token = req.params.token;

    User.findUserByToken(token)
        .then((user) => {
            res.render("Login/New_Password", {
                path: "/NewPassword",
                PageTitle: "NewPassword",
                isAuth: req.session.LoggedIn,
                errorMessage: req.flash("error")[0],
                userId : user._id,
                token: token,
            });
        })
        .catch((err) => {
            console.log(err) 
        })
};

exports.postLogin = (req, res, next) => {   
    const email = req.body.email;   
    const Password = req.body.Password;  
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).render("Login/userlogin", {
            path: "login",
            PageTitle: "LoginPage",
            isAuth: req.session.LoggedIn, 
            errorMessage: errors.array()[0].msg,
            ErrorInput: errors.array()
        });
    }
    User.findUserEmail(email)
        .then(userB => {
            if (!userB) {
                req.flash('error', 'Invalid email or password')
                return res.redirect('/login')
            }
        // console.log(userB)
        bcrypt.compare(Password, userB.Password)     
            .then((LoginMa) => {
                if (!LoginMa) {
                    req.flash("error", "Your Password Is Incorrect");
                    return res.redirect("/login");  
                }                    
            if (LoginMa) {
                req.session.userB = userB;
                req.session.LoggedIn = true;     
                return res.redirect("/");
            }
            }).catch((err) => { 
                return res.redirect('/login')    
        }) 
    }).catch(() => {
        console.log('error ocurred')  
    })
};

exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const Password = req.body.password;
    const ConfirmPassword = req.body.confirmPassword; /// we must confirm the password !!!!!!!
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("Login/SignUp", {
            path: "/signup",
            PageTitle: "SignUp",
            isAuth: req.session.LoggedIn,
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                Password: Password,
                ConfirmPassword: ConfirmPassword,
            },
        });
    }

    User.findUserEmail(email)
        .then((userDoc) => {
            if (userDoc) {
            return res.redirect('/signup') 
            }
            return bcrypt.hash(Password, 12)
        })
        .then((hashedPassword) => {
            const user = new User(
                email,
                hashedPassword,
                {
                    products: [],
                    price : 0
                }
            )
            return user.save();
        })
        .then(() => {
            res.redirect("/login"); 
        })
}
exports.postNewPassword = (req, res, next) => { 
        crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            req.flash('error', 'your information is not correct so no Token has been created')
            return res.redirect('/login')
        }
        const token = buffer.toString('hex')
            User.findUserEmail(req.body.email)
                .then((userData) => {
                    if (!userData) {
                        req.flash('error', 'Email Not Found')
                        return res.redirect("/reset_password"); 
                    }
                    const user = new User(userData.email , userData.Password , userData.cart ,  userData._id )
                    user.token = token;
                    user.tokenExpirationTime = Date.now() + 3600000;
                    user.saveUpdate()
                    console.log(user);
                    return res.send(`
                            <h1>Chaiba</h1>
                            <a href="http://localhost:3000/reset_password/${token}">Click here to reset your password</a>
                            `);

                })
                .catch((err) => {
                    console.log(err);
                });
    });
}
    
exports.postNewPasswordEmail = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const userToken = req.body.token;
    User.findUserByToken(userToken) // check the Expiredate is greater than the Date.now(); mybe when i use the mongoose
        .then((userData) => {
            if (!userData) {
                req.flash('error', 'Your Email Is Wrong')
                return res.redirect('/login');
            }
            return bcrypt.hash(newPassword, 12).then((hashedPassword) => {  
                const user = new User(
                    userData.email,
                    hashedPassword, 
                    userData.cart,
                    userData._id,
                    null,
                    0
                );
                console.log(user.Password)
                user.saveUpdate();
                return res.redirect("/");
            })
            
        })
        .catch((err) => {
            console.log(err);
        })
}

exports.postLogout = (req, res, next) => { 
    req.session.destroy((err) => {
        console.log(err)
        res.redirect("/");
    });


};