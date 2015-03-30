// server.js

var express        = require('express');
var mongoose      = require('mongoose');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var httpServer = require("http").createServer(app);



// config files
var db = require('./config/db');

// set our port
var port = 3000;

// connect to  mongoDB  
//mongoose.connect(db.url); 

// parse application/json 
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

//set the public folder of the app
app.use(express.static(__dirname + '/public'));

httpServer.listen(port);

var io = require('socket.io')(httpServer);

io.on('connection', function (socket) {
    console.log("Socket Ready");

    // broadcast a user's message to other users
    socket.on('send:mesaage', function (data) {
        socket.broadcast.emit('send:message', {
            text: data.text
        });
    });
});

// expose app           
exports = module.exports = app;

