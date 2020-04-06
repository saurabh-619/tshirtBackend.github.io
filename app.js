const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');


//my routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const stripeRoutes = require('./routes/stripePayment');
const paymentBRoutes = require('./routes/paymentB');




const app = express();


// connect to DB
mongoose.connect(process.env.DATABASE,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    console.log('Connected to DB.....');
}).catch(e => console.log(e.message))

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// My Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', stripeRoutes);
app.use('/api', paymentBRoutes);


// PORT
const port = 8000 || process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on the PORT ${port}`);
})



