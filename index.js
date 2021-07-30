const express = require('express');

const OAuth = require('oauth')
const { promisify } = require('util')
require('dotenv').config()

async function getTwitterUserProfileWithOAuth1 (url) {
  var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.CONSUMERKEY,
    process.env.CONSUMERSECRET,
    '1.0A', null, 'HMAC-SHA1'
  )
  const get = promisify(oauth.get.bind(oauth))

  const body = await get(url, undefined, undefined);

  return JSON.parse(body)
}

const app = express();

// app.use(require('body-parser').json());
//var router = express.Router();

//connect path to router
//app.use("/", router);

app.get('/tweets',async (req, res) => {
    
    const data = await fetchTweets(req.query.username);
    res.json(data);
});

//app.use(require('express-static')('./'));

function fetchTweets(username = 'ishankbahl97') {

    return getTwitterUserProfileWithOAuth1(`https://api.twitter.com/1.1/users/lookup.json?screen_name=${username}`).then(data => {
        return getTwitterUserProfileWithOAuth1(`https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${data[0].id}&count=2000`).then(data1 => ({
            data: data1
        })).catch(err => err); ;
    }).catch(err => err); 
}


app.listen(process.env.PORT || 3000)