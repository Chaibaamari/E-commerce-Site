const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')  
const User = require("../models/User"); 
const  { check , body } = require('express-validator')


router.get("/Login", authController.getLogin); 
router.post("/Login",
    [
        check('email')
            .isEmail()
            .withMessage("check again your email"),
        body('Password', "your password is wrong")
            .isLength({ min: 5 })
            .isAlphanumeric(),
    ],
    authController.postLogin
);
router.post("/Logout", authController.postLogout);   
router.get("/signup", authController.getSignup);   
router.post("/signup",
    [
        check('email')
            .isEmail()
            .withMessage('please enter a valid email')
            .custom((value, { req }) => {
                // if (value === 'test@test.com') {
                //    throw new Error('this Email is Forbiden')
                // }
                // return true;
                return User.findUserEmail(value)
                    .then((userData) => {
                        if (userData) {
                            console.log('the eamil is already exist')
                            return Promise.reject("this Email is already exist");
                        }
                    }
                    )
            }),
        body('password', 
        'please enter a password with number and symbole at least 5'
    ).isLength({min : 5}).isAlphanumeric()
    ],
    authController.postSignUp); 
router.get("/reset_password", authController.getNewPassword);  
router.post("/reset_password", authController.postNewPassword);        
router.get("/reset_password/:token", authController.getNewPasswordEmail);        
router.post("/newPassword", authController.postNewPasswordEmail);        

module.exports = router 