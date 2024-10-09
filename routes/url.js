const express = require('express')
const { handleGenrateNewURL, handleGetAnalytics } = require("../Controllers/url")
const router = express.Router();

router.post('/', handleGenrateNewURL)
router.get('/analytics/:shortId', handleGetAnalytics)
module.exports = router;