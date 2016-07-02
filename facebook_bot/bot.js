"use strict";
var SimpleFilter = require("./bot_filter/simpleFilter");
var SpamFilter = require("./bot_filter/spamFilter");
var CategoryFilter = require("./bot_filter/categoryFilter");
var SearchFilter = require("./bot_filter/searchFilter");
var TagFilter = require("./bot_filter/tagFilter");
var ButtonFilter = require("./bot_filter/buttonFilter");
var EndFilter = require("./bot_filter/endFilter");
var ImageFilter = require("./bot_filter/imageFilter");
var async = require("asyncawait/async");
var await = require("asyncawait/await");
var fbAPI = require("./api/facebookAPI");

var BOT_REPLY_TYPE = require("./constants").BOT_REPLY_TYPE;
var BUTTON_TYPE = require("./constants").BUTTON_TYPE;
var PAYLOAD = require("./constants").PAYLOAD;

var girlAPI = require("./api/girlAPI");
var csv = require("./api/utils/readcsv");
var buttonFilterSchema = require('../schema/buttonFilter');
class BotAsync {
    constructor() {

        //this._helloFilter = new SimpleFilter(["hi", "halo", "hế nhô", "he lo", "hello", "chào", "xin chào"], "Chào bạn, mềnh là bot tôi đi code dạo ^_^");
        var that = this;
        that._filters = [];
        buttonFilterSchema.find({ "botid": "57716765659a7f917bf2f0f1" }, function(err, result) {
            for (var button of result) {
                var filter = new ButtonFilter(button.keywords, button.title, button.output);
                that._filters.push(filter);
            }
        })
        
    }

    setSender(sender) {
        this._helloFilter.setOutput(`Chào ${sender.first_name}, mềnh là bot tôi đi code dạo ^_^. Bạn thích đọc gì nào?`);
        this._goodbyeFilter.setOutput(`Tạm biệt ${sender.first_name}, hẹn gặp lại ;)`);
    }

    chat(input) {
        for (var filter of this._filters) {
            if (filter.isMatch(input)) {
                filter.process(input);
                return filter.reply(input);
            }
        }
    }

    reply(senderId, textInput, accesstoken) {
        async(() => {
            var sender = await (fbAPI.getSenderName(senderId, accesstoken));
            //this.setSender(sender);

            var botReply = await (this.chat(textInput));
            var output = botReply.output;
            switch (botReply.type) {
                case BOT_REPLY_TYPE.TEXT:
                    fbAPI.sendTextMessage(senderId, output, accesstoken);
                    break;
                case BOT_REPLY_TYPE.POST:
                    if (output.length > 0) {
                        fbAPI.sendTextMessage(senderId, "Bạn xem thử mấy bài này nhé ;)");
                        fbAPI.sendGenericMessage(senderId, output, accesstoken);
                    } else {
                        fbAPI.sendTextMessage(senderId, "Xin lỗi mình không tim được bài nào ;)");
                    }
                    break;
                case BOT_REPLY_TYPE.BUTTONS:
                    let buttons = botReply.buttons;
                    fbAPI.sendButtonMessage(senderId, output, buttons, accesstoken);
                    break;
                case BOT_REPLY_TYPE.IMAGE:
                    fbAPI.sendTextMessage(senderId, "Đợi tí có liền, đồ dại gái hà ^^");
                    fbAPI.sendImage(senderId, output, accesstoken);
                    break;
                default:
            }
        })();
    }

    sendAttachmentBack(sender, attachment, accesstoken) {
        fbAPI.sendAttachmentBack(sender, attachment, accesstoken);
    }

    processPostback(senderId, payload, accesstoken) {
        async(() => {
            var sender = await (fbAPI.getSenderName(senderId));
            this.setSender(sender);
            switch (payload) {
                case PAYLOAD.TECHNICAL_POST:
                    this.reply(senderId, "{coding}", accesstoken);
                    break;
                case PAYLOAD.CAREER_POST:
                    this.reply(senderId, "{nghe nghiep}", accesstoken);
                    break;
                case PAYLOAD.GENERIC_POST:
                    this.reply(senderId, "{linh tinh}", accesstoken);
                    break;
                case PAYLOAD.SEE_CATEGORIES:
                    this.reply(senderId, "hello", accesstoken);
                    break;
                case PAYLOAD.HELP:
                    this.reply(senderId, "-help", accesstoken);
                    break;
                case PAYLOAD.GIRL:
                    this.reply(senderId, "@girl", accesstoken);
                    break;
                default:
                    console.log("Unknown payload: " + payload);
            }
        })();
    }
}

module.exports = new BotAsync();
