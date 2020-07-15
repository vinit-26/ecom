const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/authController');
const User = require('../models/user');
const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.'),
    check('password')
        .notEmpty()
        .withMessage('Password is reuired!')
], authController.postLogin);

router.post('/signup', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject(
                        'E-Mail exists already, please pick a different one.'
                    );
                }
            });
        }),
    body(
        'password',
        'Password should be, min 8 char long, At least one uppercase,At least one lower case and at least one special character.'
    )
        .isLength({ min: 8 })
        .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    })
], authController.postSignup);

router.post('/logout', authController.postLogout);

module.exports = router;