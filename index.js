const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const {restrictToLoggedinUserOnly, checkAuth} = require('./middlewares/auth')
const { connectToMongodb } = require('./connect');  // MongoDB connection
const URL = require('./models/url');  // URL model
const app = express();
const PORT = 5000;


const urlRoute = require('./routes/url');  // Route to handle URL shortener logic
const staticRoute = require('./routes/staticrouter');  // Route for static pages
const userRoute = require('./routes/user')


// Set up view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Middleware to parse JSON data
app.use(express.json());

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


// Use routes
app.use("/url",restrictToLoggedinUserOnly, urlRoute);  // Route to handle /url related requests
app.use("/", checkAuth, staticRoute);  // Route to handle static page requests
app.use("/user", userRoute)

// Handle redirect based on shortId
app.get('/:shortId', async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now()
                    }
                }
            }
        );

        // Check if entry exists
        if (!entry) {
            return res.status(404).send('URL not found');  // Return 404 if shortId is not found
        }

        res.redirect(entry.redirectURL);  // Redirect to the original URL
    } catch (error) {
        console.error('Error fetching URL:', error);
        res.status(500).send('Internal Server Error');  // Handle internal errors
    }
});

// Connect to MongoDB and start the server
connectToMongodb("mongodb://localhost:27017/short-url")
    .then(() => console.log("MongoDB connected"))
    .catch(error => console.error('Error connecting to MongoDB:', error));

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
