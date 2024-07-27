const express = require('express');
const { router: urlRoute } = require('./routes/url');
const { connectMongoDB } = require('./connection');

const app = express();
const PORT = 8001;


connectMongoDB('mongodb://127.0.0.1:27017/url-shortener')
.then(() => console.log('Connected to DB'));

app.use(express.json());
app.use('/url', urlRoute);

app.listen(PORT, ()=> console.log(`Server started at: ${PORT}`));