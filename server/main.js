//
// Define a collection
//
Messages = new Mongo.Collection("messages");


//
// importing all needed libraries
//
import { Meteor } from 'meteor/meteor';
import TelegramBot from 'node-telegram-bot-api';


//
// initialize telegram api
//
const telegramClient = new TelegramBot(Meteor.settings.telegram.client, {polling: true});
const telegramAdmin = new TelegramBot(Meteor.settings.telegram.admin, {polling: true});


//
// callback on a new client message
//
telegramClient.on('message', Meteor.bindEnvironment(telegram_onmessage_callback));
var previousId; // check if we already answered
function telegram_onmessage_callback(msg) {
  // console.log('telegramClient:', msg);

  if(previousId == msg.chat.id+'-'+msg.message_id) return;
  previousId = msg.chat.id+'-'+msg.message_id;

  // check if it's a question or not
  // if(msg.text !== undefined && msg.text.indexOf('?') > 0 || process.env.NODE_ENV === "development") {
    sendToAdministrators(msg);
  // } else {
  //   // do something else if not
  // }

}


//
// forward message to Administrators
//
function sendToAdministrators(msg) {
  if(Meteor.settings.telegram.administrators === undefined) return;
  Meteor.settings.telegram.administrators.forEach(function(chat_id){

    const text = "<i>"+msg.from.first_name+"</i>:\n"+msg.text;
    telegramAdmin.sendMessage(chat_id, text, {parse_mode: "HTML", reply_markup: {force_reply: true}})
    .then(Meteor.bindEnvironment(function(response){
      // console.log('msg', msg, 'response', response);
      Messages.insert({msg: msg, sent: response, chat: "admin"});
    }));

  });
}


//
// callback on a new Administrator message
//
telegramAdmin.on('message', Meteor.bindEnvironment(function(msg){
  if (msg.reply_to_message === undefined) return;
  messageOfReply = Messages.findOne({'sent.message_id': msg.reply_to_message.message_id, chat: "admin"});
  if(messageOfReply === undefined) return;
  // console.log('messageOfReply', messageOfReply);
  sentToClient(messageOfReply.msg.chat.id, msg.text);
}));


//
// send to Client
//
function sentToClient(chatId, text) {
  sendMessage(telegramClient, chatId, text);
}


//
// send a message
//
function sendMessage(telegram, chatId, message) {
  telegram.sendChatAction(chatId, 'typing');
  Meteor.setTimeout(function(){
    telegram.sendMessage(chatId, message);
  }, 1500);
}

