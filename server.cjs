/* eslint-disable no-undef */
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
dotenv.config(); 
require('./config/database.cjs')

const { createTweet, getTweets, updateTweet, deleteTweet } = require('./controllers/tweets.cjs')


const app = express();
app.use(express.json());

app.use(cors({
	origin: "*"
}))

app.use(morgan('dev'));

app.use(helmet());



const User = require('./models/User.cjs')

// CRUD - Create, Read, Update, Delete

// C
app.post('/tweets', createTweet)

app.post('/users', async (req, res) => {
    const newUser = req.body;
    console.log(newUser);
    try {
        const response = await User.create(newUser);
        res.status(201).send(response);
    } catch (error) {
        res.status(500).send("Error creating new user");
    }
});

// R
app.get('/tweets', getTweets)

// U send ID in params. Send update stuff in req.body
app.put('/tweets/:tweetId/:newTitle', updateTweet)

// D
app.delete('/tweets/:tweetId', deleteTweet)


app.listen(4002, () => {
    console.log("listening on 4002")
})
