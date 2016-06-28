"use strict";
var request = require("request");
var atob = require("atob");

class FacebookAPI {
    constructor() {
        //this._token = process.env.FB_TOKEN ||
          //  atob("EAAJKZAdn17I4BAN1umyMX4n9mfjnUbZBXL7ZBWihLcsCf7r6QLp5Id8W7SQvBATgeu1dEi8YbqX3LkecLIZBGmXiOHDdkHhg0bnOC1LXwZAPRxHJRRXhLPCGKZAaOXqxlRDSo4HlusjFOk2VZAZA28Cf39YMlbdSM5VY8IwJqCUJ2AZDZD");
        this._storedUsers = {};
    }

    getSenderName(senderId, accesstoken) {
        var that = this;
        return new Promise((resolve, reject) => {
            if (that._storedUsers[senderId]) {
                resolve(that._storedUsers[senderId]);
            } else {

                request({
                    url: `https://graph.facebook.com/v2.6/${senderId}`,
                    qs: {
                        access_token: accesstoken,
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

    sendTextMessage(senderId, text,  accesstoken) {
        var messageData = {
            text: text
        };
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token:  accesstoken,
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
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }

    sendButtonMessage(senderId, text, buttons,  accesstoken) {
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
                access_token:  accesstoken,
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
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }

    sendAttachmentBack(senderId, attachment,  accesstoken) {
        var messageData = {
            attachment: attachment
        };
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token:  accesstoken,
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
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }

    sendImage(senderId, imageUrl,  accesstoken) {
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
                access_token:  accesstoken,
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
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }

    sendGenericMessage(senderId, posts,  accesstoken) {

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
                access_token:  accesstoken,
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
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }
}

module.exports = new FacebookAPI();