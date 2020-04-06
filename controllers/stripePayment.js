const stripe = require('stripe')("sk_test_VGVmWuc2cdWqkTgIK0S2eSFV00dYm0brsO")
const uuid = require('uuid/v4');


const makePayment = (req, res) => {
    const { products, token } = req.body;

    let amount = 0;
    products.forEach(product => {
        amount = amount + product.price * product.count;
    });

    //key for not charging again in case of some network issue
    const idempotencyKey = uuid();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: amount * 0.013 * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: "a Test account",
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip,
                }
            }

        }, { idempotencyKey })
            .then(result => res.status(200).json(result))
            .catch(err => console.log(err))
    })

}

module.exports = makePayment;