const router = require('express').Router();

const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { getToken, processPayment } = require('../controllers/paymentB');
const { getUserById } = require('../controllers/user');


router.param('userId', getUserById);

// get Token
router.get('/payment/gettoken/:userId', isSignedIn, isAuthenticated, getToken);

// process Payment
router.post('/payment/braintree/:userId', isSignedIn, isAuthenticated, processPayment)


module.exports = router;