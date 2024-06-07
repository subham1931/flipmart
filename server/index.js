const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();

const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;

const authRouter = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

dbConnect();

app.use(express.json());


app.use('/api/user', authRouter)

app.use(notFound);
app.use(errorHandler);

// app.use('/', (req, res) => {
//     res.send('Hello server')
// })

app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
})