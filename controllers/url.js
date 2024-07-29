const shortid = require('shortid');
const { URL } = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if(!body.url) {
        return res.status(400).json({ error: 'url is required'});
    }
    const shortID = shortid(8);
    await URL.create({
        shortId: shortID,
        redirectUrl: body.url,
        visitHistory: [],
    });

    return res.render('home', {
        id: shortID,
    });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    if(!result) return res.status(404).json({"Error": "URL not found"});
    return res.json({
        Clicks: result.visitHistory.length,
        Details: result.visitHistory
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
}