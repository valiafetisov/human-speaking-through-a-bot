//
// Define a collection
//
Messages = new Mongo.Collection("messages");
Users = new Mongo.Collection("users");


//
// importing all needed libraries
//
import { Meteor } from 'meteor/meteor';
import TelegramBot from 'node-telegram-bot-api';


//
// initialize telegram api
//
const telegram = new TelegramBot(Meteor.settings.telegram.client, {polling: true});


//
// callback on a new client message
//
telegram.on('message', Meteor.bindEnvironment(telegram_onmessage_callback));
var previousId; // check if we already answered
function telegram_onmessage_callback(msg) {
  console.log('telegram_onmessage_callback:', msg);

  if(previousId == msg.chat.id+'-'+msg.message_id) return;
  previousId = msg.chat.id+'-'+msg.message_id;

  if(msg.text === undefined) return;

  // check if it's a question or not
  if(msg.text == "/login") {
    updateUser(msg, 'login');
  } else if(msg.text == "/logout") {
    updateUser(msg, 'logout');
  } else {
    const user = getUser(msg);
    if(user.isAdmin) {
      forwardToClient(msg);
    } else {
      sendToAdministrators(msg);
    }
  }
}


function createUserObject(msg) {
  if(msg === undefined) return;
  return {userId: msg.from.id, chatId: msg.chat.id, name: msg.from.first_name};
}


function updateUser(msg, flag) {
  const user = Users.findOne({userId: msg.from.id});
  const userObj = chreateUserObject(msg);
  if(flag === 'login') {
    userObj.isAdmin = true;
  } else if(flag === 'logout') {
    userObj.isAdmin = false;
  }
  if(user === undefined){
    Users.insert(userObj);
  } else {
    Users.update(user._id, {$set: userObj});
  }
}


function getUser(msg) {
  const user = Users.findOne({userId: msg.from.id});
  if(user !== undefined) return user;

  const userObj = chreateUserObject(msg);
  const id = Users.insert(userObj);
  userObj._id = id;
  return userObj;
}


//
// forward message to Administrators
//
function sendToAdministrators(msg) {
  const admins = Users.find({isAdmin: true}).fetch();
  console.log('sendToAdministrators', admins, msg);
  if(admins === undefined || admins.length <= 0) throw new Meteor.Error('there are no admins');

  admins.forEach(function(each){

    const text = "<i>"+msg.from.first_name+"</i>:\n"+msg.text;
    telegram.sendMessage(each.chatId, text, {parse_mode: "HTML", reply_markup: {force_reply: true}})
    .then(Meteor.bindEnvironment(function(response){
      // console.log('msg', msg, 'response', response);
      Messages.insert({msg: msg, sent: response, chat: "admin"});
    }));

  });
}


//
// callback on a new Administrator message
//
function forwardToClient(msg){
  if (msg.reply_to_message === undefined) return;
  messageOfReply = Messages.findOne({'sent.message_id': msg.reply_to_message.message_id, chat: "admin"});
  if(messageOfReply === undefined) return;
  // console.log('messageOfReply', messageOfReply);
  sendMessage(messageOfReply.msg.chat.id, msg.text);
}


//
// send a message
//
function sendMessage(chatId, message) {
  telegram.sendChatAction(chatId, 'typing');
  Meteor.setTimeout(function(){
    telegram.sendMessage(chatId, message);
  }, 1500);
}

