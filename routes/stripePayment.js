const router = require('express').Router();
const makePayment = require('../controllers/stripePayment');


router.post('/stripepayment', makePayment)

module.exports = router;