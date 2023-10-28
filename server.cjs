/* eslint-disable no-undef */
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const validator = require('validator');
dotenv.config(); 
require('./config/database.cjs')

// for hashing passwords
const bcrypt = require('bcrypt');
// for creating jwt tokens
const jwt = require('jsonwebtoken');

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
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const response = await User.create({...req.body, password: hashedPassword});
        res.status(201).send(response);
    } catch (error) {
        res.status(500).send("Error creating new user");
    }
});

app.post('/login', async (req, res) => {
    const dbUser = await User.findOne({email: req.body.email});
    if(!dbUser){
        // return so that we immediately exit out of this function afterwards
        return res.status(400).send("email or password incorrect");
    }else{
        // req.body.password is UNHASHED pw that user typed in on frontend
        // dbUser.password is hashed pw stored on db
        bcrypt.compare(req.body.password, dbUser.password, (err, isMatch) => {
            if(isMatch){
                dbUser.password = "";
                const token = jwt.sign({dbUser}, process.env.TOKEN_SECRET, {expiresIn: "1hr"});
                res.status(200).send({token, dbUser});
            }else{
                res.status(400).send("email or password incorrect");
            }
        })
    }

})

// R
app.get('/tweets', getTweets)

// U send ID in params. Send update stuff in req.body
app.put('/tweets/:tweetId/:newTitle', updateTweet)

// D
app.delete('/tweets/:tweetId', deleteTweet)


app.listen(4002, () => {
    console.log("listening on 4002")
})
