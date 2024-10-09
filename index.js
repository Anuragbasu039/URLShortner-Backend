const express = require('express')
const urlRoute = require('./routes/url')
const app = express()
const PORT = 5000
const { connectToMongodb } = require('./connect')
const URL = require('./models/url')

app.use(express.json())

app.use("/url", urlRoute)
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            },
        }
    })
    res.redirect(entry.redirectURL)
})

connectToMongodb("mongodb://localhost:27017/short-url")
    .then(() => console.log("mongodb conected")
    )

app.listen(PORT, () => console.log(`Server started at port PORT: ${PORT}`)
)