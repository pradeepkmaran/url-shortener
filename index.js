const express = require('express');
const { router: urlRoute } = require('./routes/url');
const { connectMongoDB } = require('./connection');
const { URL } = require('./models/url');
const { handleGetAnalytics } = require('./controllers/url');

const app = express();
const PORT = 8001;


connectMongoDB('mongodb://127.0.0.1:27017/url-shortener')
.then(() => console.log('Connected to DB'));

app.use(express.json());
app.use('/url', urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        }
    });

    res.redirect(entry.redirectUrl);
});

app.get('/analytics/:shortId', handleGetAnalytics);

app.listen(PORT, ()=> console.log(`Server started at: ${PORT}`));