const express = require('express')
const app = express()
require('dotenv').config()

const stripe = require('stripe')(process.env.STRIPE_TEST_KEY)

const PORT = 3000

const parseEvent = (signature,body) => {
    let event;
    try {
        event = stripe.webhooks.constructEvent(body,signature,process.env.ENDPOINT_SECRET)
    } catch (err) {
        return null;
    }
    return event;
}

app.post(
    "/stripe_checkout",
    express.raw({ 
        type: 'application/json'
    }),(req,res) => {
        const signature = req.headers['stripe-signature']

        let event = parseEvent(signature,req.body)

        if(event){
            console.log(event.type)
            res.send()
        }else{
            res.status(400).send(`Webhook Error: ${err.message}`)
        }
    }
)

app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`)
})