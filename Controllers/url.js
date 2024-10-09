const shortid = require('shortid');
const URL = require('../models/url'); // Assuming this is your Mongoose model

async function handleGenrateNewURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "URL is required" });

    const shortID = shortid.generate(); // Generate the short ID

    try {
        // Insert the new URL into the MongoDB database
        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitedHistory: [],
        });

        return res.json({ id: shortID });
    } catch (error) {
        return res.status(500).json({ error: "Database error", details: error.message });
    }
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId })
    return res.json({ totalClickds: result.visitHistory.length, analytics: result.visitHistory })
}

module.exports = {
    handleGenrateNewURL,
    handleGetAnalytics,
};
