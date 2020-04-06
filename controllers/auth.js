const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


const signup = (req, res) => {
    const errors = validationResult(req);
    // here errors is the object
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        })
    }

    const newUser = new User(req.body);
    newUser.save((err, savedUser) => {
        if (err) {
            return res.status(400).json({
                error: err.message,
            })
        }
        res.status(200).json({
            activity: 'User saved',
            user: savedUser
        })

    });
}

const signin = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    // console.log(typeof (errors));  type=object
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        })
    }

    User.findOne({ email }, (err, foundUser) => {

        if (err || !foundUser) {
            return res.status(422).json({
                error: "User not doesn't exist"
            })
        }

        if (!foundUser.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password is not matching"
            })
        }

        // So far, so good, so do sign in the User i.e create token
        const token = jwt.sign({ _id: foundUser._id }, process.env.SECRET);
        // put token in cookie
        res.cookie('token', token, { expire: new Date() + 9999 })  //'token' is name of cookie created

        // send response to frontend
        const { _id, name, email, role } = foundUser;
        return res.json({
            token,
            user: {
                _id, name, email, role
            }
        })
    })
}

const signout = (req, res) => {
    res.clearCookie('token');     //this method is available due to cookieParser
    res.json({
        message: 'User signed out successfully....',
    })
}


// protected routes 
// next() is internally implemented by express-jwt
const isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: 'auth'
})


// custom middleware
const isAuthenticated = (req, res, next) => {
    // req.profile=logged in user
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: 'Access Denied'
        })
    }
    next();
}

const isAdmin = (req, res, next) => {
    if (req.profile.role === 1) {
        return res.status(403).json({
            error: "You are not Admin, so access denied"
        })
    }
    next();
}

module.exports = { signup, signout, signin, isSignedIn, isAuthenticated, isAdmin }