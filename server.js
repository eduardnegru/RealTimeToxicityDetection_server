"use strict";

const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const routes = require('./api/routes/route');
const dashboard = require('./api/controllers/Dashboard');
const redisClass = require("async-redis");
const redis = redisClass.createClient();


let path = require('path');
global.appRoot = path.resolve(__dirname);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Authorization, *");
      next();
});

routes(app);

var server = app.listen(port);
const io = require('socket.io')(server);

io.on('connection', socket => {
      
      let bFirstCall = true;
      let nLastID = null;
      
      socket.on("toxic", strTimestamp => {
            console.log("Toxic here");
            this.toxicIntervalHandler = setInterval(async () => {
                  let arrMessages = await dashboard.messages_get(socket, bFirstCall ? strTimestamp : null, nLastID, true);

                  bFirstCall=false;

                  if(arrMessages.length)
                  {
                        nLastID = arrMessages[arrMessages.length - 1].message_id;
                  }
                  console.log("Polling toxic");
                  socket.emit("toxic_data", arrMessages);
            }, 1500);
      });
      
      socket.on("toxic_end", () => { console.log("ending"); clearInterval(this.toxicIntervalHandler);});

      socket.on("not_toxic", strTimestamp => {
            console.log("Not Toxic here");
            this.notToxicIntervalHandler = setInterval(async () => {
                  let arrMessages = await dashboard.messages_get(socket, bFirstCall ? strTimestamp : null, nLastID, false);

                  bFirstCall=false;

                  if(arrMessages.length)
                  {
                        nLastID = arrMessages[arrMessages.length - 1].message_id;
                  }
                  console.log("Polling not_toxic");
                  socket.emit("not_toxic_data", arrMessages);
            }, 1500);
      });

      socket.on("not_toxic_end", () => { console.log("ending"); clearInterval(this.notToxicIntervalHandler);});

      





});




exports.server = server;
module.exports = redis;