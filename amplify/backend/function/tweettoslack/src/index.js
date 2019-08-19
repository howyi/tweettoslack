/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const { IncomingWebhook } = require('@slack/webhook');
const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

const Twitter = require('twitter');

let undefinedEnv = [];
Object.keys(process.env).forEach(function (key) {
  if ('####' === process.env[key]) {
    undefinedEnv.push(key);
  }
});

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

let Bucket = 'tweettoslack';
if(process.env.ENV && process.env.ENV !== "NONE") {
  Bucket = Bucket + '-' + process.env.ENV;
}

// ① Run regularly with CloudWatch Events
exports.handler = async function (event, context) { //eslint-disable-line

  if (undefinedEnv.length > 0) {
    console.error('Undefined environments', undefinedEnv);
    return;
  }

  let param = {
    q: process.env.SEARCH_QUERY + ' exclude:retweets'
  };

  try {
    // Check if the latest acquired tweet ID is in S3, and if so, only subsequent tweets will be acquired
    const object = await S3.getObject({
      Bucket,
      Key: 'since_id',
    }).promise();

    param['since_id'] = object.Body.toString();
  } catch (e) {
    console.log(e)
  }

  // ② get tweets from API
  const result = await twitterClient.get('search/tweets', param);

  // ④ Throw the acquired tweets to the CloudWatch
  console.log(result);

  let nextSinceId;
  for (let tweet of result.statuses) {
    let expanded_text = tweet.text;

    if (tweet.extended_entities) {
      for (let media of tweet.extended_entities.media) {
        expanded_text = expanded_text.replace(
            media.url,
            media.media_url_https,
        )
      }
    }

    await webhook.send({
      text:  expanded_text,
      username: tweet.user.name,
      icon_url: tweet.user.profile_image_url_https,
      unfurl_links: true,
      unfurl_media: true,
    });

    if ((!nextSinceId) || (nextSinceId <= tweet.id_str)) {
      nextSinceId = tweet.id_str;
    }
  }

  if (nextSinceId) {
    // ③ Save the latest Tweet ID to S3
    await S3.putObject({
      Bucket,
      Key: 'since_id',
      ContentType: 'text/plain',
      Body: nextSinceId
    }).promise();
  }
};
