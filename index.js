const app = require('express')(),
    TeleBot = require('telebot'),
    config = require('./config'),
    bot = new TeleBot(config),
    http = require('http').Server(app),
    exec = require('child_process').exec,
    io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log("a user connected");
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
      console.log('listening on *:3000');
});

bot.on('/msg', function(msg) {
    text = msg.text.slice(5);
    io.emit('event', text);
});

bot.on('/fo', function(msg) {
    io.emit('fo', '');
});

bot.on('/sound', function(msg) {
    io.emit('sound', msg.text.slice(7));
});
bot.start();
