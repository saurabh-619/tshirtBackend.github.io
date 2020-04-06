const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const { signup, signout, signin, isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');

router.post('/signup', [
    check('name', 'Name should be at least 3 characters').isLength({ min: 3 }),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password should be at least 5 characters').isLength({ min: 5 })
], signup);

router.post('/signin', [
    check('email', 'Please provide us email').isEmail(),
    check('password', 'Please provide us Password').isLength({ min: 1 }),
], signin);

router.get('/signout', signout);

router.get('/test', isSignedIn, isAdmin, (req, res) => {
    res.json(req.auth)
})
module.exports = router;