const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { validationResult } = require('express-validator');
exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('error')
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password
    const errors = validationResult(req);
    console.log(errors.array())
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
        });
    }
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email.');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            res.redirect('/')
                        });
                    }
                    req.flash('error', 'Invalid Password.');
                    res.redirect('/login')
                });
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: req.flash('error'),
        oldData: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldData: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            }
        });
    }
    bcrypt.hash(password, 12)
        .then(hashPassword => {
            const userData = new User({
                email: email,
                password: hashPassword,
                cart: { items: [] }
            });
            return userData.save()
        })
        .then(result => {
            if (!result) {
            }
            else {
                res.redirect('/login');
            }
        })
        .catch(err => console.log(err.message));
};