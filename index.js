var app = require('express')(),
    TeleBot = require('telebot'),
    config = require('./config'),
    bot = new TeleBot(config),
    http = require('http').Server(app),
    exec = require('child_process').exec,
    io = require('socket.io')(http);

var intro = ["Tervetuloa Ftmk'17"];
var index = 0;

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
    exec("aplay beep-07.wav");
    text = msg.text.slice(5);
    io.emit('event', text);
});

bot.on('/fo', function(msg) {
    io.emit('fo', '');
});

bot.on('/sound', function(msg) {
    io.emit('sound', msg.text.slice(7));
    console.log(msg + " sent");
});
bot.on('/start', function(msg) {
    var url = "https://www.youtube.com/embed/OFDLY2ax7L8";
    io.emit('sound', url);
    io.emit('start', '');
});

function nextLine(){
    io.emit('event', intro[index]);
    if(index < intro.length-1){
        index += 1;
        setTimeout(nextLine, 10000);
    }
    else{
        setTimeout(function(){
            var url = "https://www.youtube.com/embed/OFDLY2ax7L8";
            io.emit('sound', url);
            io.emit('start', '');
            io.emit('event', '');
        },8000);
    }

}

bot.on('/intro', function() {
    setTimeout(nextLine, 2000);
});

bot.on('/wake', function() {
    exec("xset -dpms");
});

bot.start();
exec("xset dpms force standby");
exec("chromium-browser --kiosk http://localhost:3000 --disable-infobars");
