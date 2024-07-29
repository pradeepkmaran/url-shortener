const express = require('express');
const path = require('path');
const { router: urlRoute } = require('./routes/url');
const { connectMongoDB } = require('./connection');
const { URL } = require('./models/url');
const { handleGetAnalytics } = require('./controllers/url');
const { router: staticRoute } = require('./routes/staticrouter'); 
const { ejs } = require('ejs');

const app = express();
const PORT = 8001;

connectMongoDB('mongodb://127.0.0.1:27017/url-shortener')
.then(() => console.log('Connected to DB'));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/url', urlRoute);
app.use('/', staticRoute);

app.get('/url/:shortId', async (req, res) => {
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