var http = require('http');
var log = require('simple-node-logger').createSimpleLogger('project.log');
var logger = require('morgan');
var bodyParser = require('body-parser');
var async = require("asyncawait/async");
var await = require("asyncawait/await");
var express = require('express');
var async = require('async');
var mongoose = require('mongoose');

var botschema = require('./schema/bot');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
var server = http.createServer(app);

async.waterfall([
    function(callback) {
        mongoose.connect('mongodb://quy2512:quy2512@ds023674.mlab.com:23674/tranquy_chatbot');
        callback(null);
    },
    function(callback) {

        app.get('/', (req, res) => {
            res.send("Home page. Server running okay.");
        });

        app.get('/webhook/:botid', function(req, res) {
            if (req.query['hub.verify_token'] === 'messbostic') {
                res.send(req.query['hub.challenge']);
            }
            res.send('Error, wrong validation token');
        });

        app.get('/bot/:botid', function(req, res) {
            var botid = req.params.botid;
            botschema.find({ "_id": botid }, function(err, result) {
                if (err) {
                    console.log(err);
                    res.status(200).send("bot not found");
                } else {
                    res.send(result);
                }
            });
        });

        app.get('/addbot/:accesstoken', function(req, res) {
            var accesstoken = req.params.accesstoken;
            var newbot = botschema({ accesstoken: accesstoken });
            newbot.save(function(err) {
                if (err) {
                    logger.fatal(err);
                } else {
                    res.send(newbot._id);
                }
            });
        });

        app.post('/webhook/:botid', function(req, res) {
            var botid = req.params.botid;
            
            botschema.find({ "_id": botid }, function(err, result) {
                if (err) {
                    res.status(200).send("bot not found");
                } else {
                    var accesstoken = result[0].accesstoken;
                    var fbbot = require("./facebook_bot/bot");
                    var entries = req.body.entry;
                    for (var entry of entries) {
                        log.info(entries);
                        var messaging = entry.messaging;
                        for (var message of messaging) {
                            var senderId = message.sender.id;
                            if (message.message) {
                                // If user send text
                                if (message.message.text) {
                                    fbbot.reply(senderId, message.message.text, accesstoken);
                                }
                                // If user send attachment
                                else if (message.message.attachments) {
                                    fbbot.sendAttachmentBack(senderId, message.message.attachments[0], accesstoken);
                                }
                            }
                            // If user click button
                            else if (message.postback) {
                                var payload = message.postback.payload;
                                fbbot.processPostback(senderId, payload, accesstoken);
                            }
                        }
                    }

                    res.status(200).send("OK");


                }
            });

        });

        callback(null);
    }
], function(err) {
    if (err) {
        logger.error(err);
        process.exit(1);
    } else {
        app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
        app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1");

        server.listen(app.get('port'), app.get('ip'), function() {
            console.log("Express server listening at %s:%d ", app.get('ip'), app.get('port'));
        });
    }
});
