### About

"Human speaking through a bot" is a proof-of-concept of a two chat bots logically connected with each other. One is a public and receive messages from everyone, second is private and forward messages from all users talking with a public one. Most importantly, private bot can forward messages back to a specific user of public bot. So the user would talk with an administrator through a bot identity.


### Quick start

1. `cd` to a project folder
2. `cp configurations/settings-example.json configurations/settings.json`
3. obtain two bot tokens from a [@BotFather](https://telegram.me/botfather)
4. edit `settings.json` and paste there those tokens and your user_id
5. `meteor run --settings configurations/settings.json`