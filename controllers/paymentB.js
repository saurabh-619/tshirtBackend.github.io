const express = require('express');
const braintree = require("braintree");


const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "3x882fzbb8p6hgbg",
    publicKey: "txxfsnr63rgdnw2h",
    privateKey: "9c91856085300de287ec43a8b3888cd9"
});


const getToken = (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.send(response)      //dont use json here, not allowed by braintree
        }
    });
}


const processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromClient = req.body.amount;
    let deviceDataFromTheClient;
    gateway.transaction.sale({
        amount: amountFromClient,
        paymentMethodNonce: nonceFromTheClient,
        deviceData: deviceDataFromTheClient,
        options: {
            submitForSettlement: true
        }
    }, function (err, result) {
        if (err) {
            res.status(500).json({ error: err })
        } else {
            res.json(result
            )
        }
    });
}

module.exports = { getToken, processPayment };
