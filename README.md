Search Twitter and send results to Slack automatically.  
Work on your AWS.

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/howyi/tweettoslack)  
# Cost
It's free because it's all within the AWS free tier.
# Requirements
- [Slack Incoming Webhook URL](https://api.slack.com/incoming-webhooks)
  - SLACK_WEBHOOK_URL
- [Twitter API Token](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens.html)
  - TWITTER_CONSUMER_KEY
  - TWITTER_CONSUMER_SECRET
  - TWITTER_ACCESS_TOKEN_KEY
  - TWITTER_ACCESS_TOKEN_SECRET
# Deploy
- Click the `DEPLOY TO AMPLIFY CONSOLE` button.
- After deploy, access to Lambda `tweettoslack-amplify`. and set environment variables.
  - SEARCH_QUERY: [Twitter standard search operators](https://developer.twitter.com/en/docs/tweets/search/guides/standard-operators.html)
# Diagram
![](https://cdn-ak.f.st-hatena.com/images/fotolife/h/howyi/20190820/20190820004315.png)
