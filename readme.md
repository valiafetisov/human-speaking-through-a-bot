### About

"Human speaking through a bot" is a proof-of-concept of a two chat bots logically connected with each other. One is a public and receive messages from everyone, second is private and forward messages from all users talking with a public one. Most importantly, private bot can forward messages back to a specific user of public bot. So the user would talk with an administrator through a bot identity.

[`single`](https://github.com/valiafetisov/human-speaking-through-a-bot/tree/single) branch has a realisation of single bot being public and private at the same time using login/logout sistem for administrators.


### Technical information

Project made using [meteor.js](http://meteor.com) and [telegram](https://telegram.me) [forcereply feature](https://core.telegram.org/bots/api#forcereply) and ability of telegram reply directly to user message. Build using [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) npm package.


### Quick start

1. `cd` to a project folder
2. `cp configurations/settings-example.json configurations/settings.json`
3. obtain two bot tokens from a [@BotFather](https://telegram.me/botfather)
4. edit `settings.json` and paste there those tokens
5. install dependencies `meteor npm install`
5. `meteor run --settings configurations/settings.json`