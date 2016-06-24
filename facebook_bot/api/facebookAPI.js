"use strict";
var request = require("request");
var atob = require("atob");

class FacebookAPI {
    constructor() {
        this._token = process.env.FB_TOKEN ||
            atob("EAADWaoQKTdwBAOZA5sxxxLe2YTOLZA46b2atSryJgmH60jwKp5DMfDvN0LkF5nwSYTUUV9TZATNBrrLGDNzxJcLUqZCTNEoSstoLJ1Thza3JHjHTHrZAXgf9DE6RcWrJ74ZAEMDRt4wRzAgj2pV1Ek88eZC9hEL79d9jdYFAZBJz1wZDZD");
        this._storedUsers = {};
    }

    getSenderName(senderId) {
        var that = this;
        return new Promise((resolve, reject) => {
            if (that._storedUsers[senderId]) {
                resolve(that._storedUsers[senderId]);
            }
            else {

                request({
                    url: `https://graph.facebook.com/v2.6/${senderId}`,
                    qs: {
                        access_token: that._token
                    },
                    method: 'GET',

                }, function(error, response, body) {
                    var person = JSON.parse(body);
                    that._storedUsers[senderId] = person;
                    resolve(person);
                });
            }
        });
    }

    sendTextMessage(senderId, text) {
        var messageData = {
            text: text
        };
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: this._token
            },
            method: 'POST',
            json: {
                recipient: {
                    id: senderId
                },
                message: messageData,
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending message: ', error);
            }
            else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }

    sendButtonMessage(senderId, text, buttons) {
        var messageData = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": text,
                    "buttons": buttons
                }
            }
        };

        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: this._token
            },
            method: 'POST',
            json: {
                recipient: {
                    id: senderId
                },
                message: messageData,
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending message: ', error);
            }
            else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }

    sendAttachmentBack(senderId, attachment) {
        var messageData = {
            attachment: attachment
        };
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: this._token
            },
            method: 'POST',
            json: {
                recipient: {
                    id: senderId
                },
                message: messageData,
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending message: ', error);
            }
            else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }

    sendImage(senderId, imageUrl) {
        var messageData = {
            attachment: {
                type: "image",
                payload: {
                    url: imageUrl
                }
            }
        };
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: this._token
            },
            method: 'POST',
            json: {
                recipient: {
                    id: senderId
                },
                message: messageData,
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending message: ', error);
            }
            else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }

    sendGenericMessage(senderId, posts) {

        var messageData = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": []
                }
            }
        };

        var messageElements = posts.map(post => {
            return {
                title: "Article",
                subtitle: post.title,
                item_url: post.URL,
                image_url: post.featured_image,
                buttons: [{
                    type: "web_url",
                    url: post.URL,
                    title: "Read this"
                }]
            }
        });

        messageData.attachment.payload.elements = messageElements;
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: this._token
            },
            method: 'POST',
            json: {
                recipient: {
                    id: senderId
                },
                message: messageData,
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending message: ', error);
            }
            else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }
}

module.exports = new FacebookAPI();
