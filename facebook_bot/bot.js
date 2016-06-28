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

class BotAsync {
    constructor() {

        //this._helloFilter = new SimpleFilter(["hi", "halo", "hế nhô", "he lo", "hello", "chào", "xin chào"], "Chào bạn, mềnh là bot tôi đi code dạo ^_^");
        var that = this;
        csv.readcsv("bot.csv", function(filters) {

                console.log(filters);
                for (var filter of filters) {
                    if (filter.name ===  "helloFilter") {
                        that._helloFilter = new ButtonFilter(filter.keywords.split(";"),
                            "Chào bạn, mềnh là bot tôi đi code dạo ^_^. Bạn thích đọc gì nào?", [{
                                title: "Nâng cao trình độ",
                                type: BUTTON_TYPE.POSTBACK,
                                payload: PAYLOAD.TECHNICAL_POST
                            }, {
                                title: "Tìm hiểu nghề nghiệp",
                                type: BUTTON_TYPE.POSTBACK,
                                payload: PAYLOAD.CAREER_POST
                            }, {
                                title: "Các thứ linh tinh",
                                type: BUTTON_TYPE.POSTBACK,
                                payload: PAYLOAD.GENERIC_POST
                            }]);
                    } else if (filter.name === "girlFilter") {
                        var girlFilter = new ImageFilter(filter.keywords.split(";"), girlAPI.getRandomGirlImage.bind(girlAPI)); // From xkcn.info
                    } else if (filter.name === "sexyGirlFilter") {
                        var sexyGirlFilter = new ImageFilter(filter.keywords.split(";"),
                            girlAPI.getRandomSexyImage.bind(girlAPI, "637434912950811", 760)); // From xinh nhẹ nhàng 
                    } else if (filter.name === 'javGirlFilter') {
                        var javGirlFilter = new ImageFilter(filter.keywords.split(";"),
                            girlAPI.getRandomSexyImage.bind(girlAPI, "1517626138559626", 225)); // From hội JAV
                    } else if (filter.name === 'bikiniGirlFilter') {
                        var bikiniGirlFilter = new ImageFilter(filter.keywords.split(";"),
                            girlAPI.getRandomSexyImage.bind(girlAPI, "169971983104176", 1070)); // From hội bikini
                    } else if (filter.name === 'helpFilter') {
                        var helpFilter = new ButtonFilter(filter.keywords.split(";"),
                            `Do bot mới được phát triển nên chỉ có 1 số tính năng sau:\n1. Hỏi linh tinh (ioc là gì, tao muốn học javascript).\n2. Tìm từ khóa với cú pháp [từ khóa] (Cho tao 4 bài [java]).\n3. Chém gió vui.\n4. Xem bài theo danh mục.\n5. Xem hình gái xinh @gái.`, [{
                                title: "Danh mục bài viết",
                                type: BUTTON_TYPE.POSTBACK,
                                payload: PAYLOAD.SEE_CATEGORIES
                            }, {
                                title: "Xem hình gái",
                                type: BUTTON_TYPE.POSTBACK,
                                payload: PAYLOAD.GIRL
                            }]);
                    } else if (filter.name === 'botInfoFilter') {
                        var botInfoFilter = new SimpleFilter(filter.keywords.split(";"),
                            "Mình là chat bot Tôi đi code dạo. Viết bởi anh Hoàng đập chai cute <3");
                    } else if (filter.name === 'adInfoFilter') {
                        var adInfoFilter = new SimpleFilter(filter.keywords.split(";"),
                            "Ad là Pham Huy Hoàng, đập chai cute thông minh tinh tế <3. Bạn vào đây xem thêm nhé: https://toidicodedao.com/about/");
                    } else if (filter.name === 'thankyouFilter') {
                        var thankyouFilter = new SimpleFilter(filter.keywords.split(";"), "Không có chi. Rất vui vì đã giúp được cho bạn ^_^");
                    } else if (filter.name === 'categoryFilter') {
                        var categoryFilter = new SimpleFilter(filter.keywords.split(";"),
                            "Hiện tại blog có 3 category: coding, linh tinh, và nghề nghiệp");
                    } else if (filter.name === 'chuiLonFilter') {
                        var chuiLonFilter = new SimpleFilter(filter.keywords.split(";"),
                            "Bot là người nhân hậu, không chửi thề. Cút ngay không bố đập vỡ cmn ass bây giờ :v!");
                    } else if (filter.name === 'testFilter') {
                        var testFilter = new SimpleFilter(filter.keywords.split(";"),
                            "Đừng test nữa, mấy hôm nay người ta test nhiều quá bot mệt lắm rồi :'(");
                        that._goodbyeFilter = new SimpleFilter(["tạm biệt", "bye", "bai bai", "good bye"], "Tạm biệt, hẹn gặp lại ;)");

                    }
                }

                that._filters = [new SpamFilter(),
                    new SearchFilter(), new CategoryFilter(), new TagFilter(),
                    girlFilter, sexyGirlFilter, javGirlFilter, bikiniGirlFilter,
                    adInfoFilter, botInfoFilter, categoryFilter,
                    chuiLonFilter, thankyouFilter, helpFilter,
                    that._goodbyeFilter, that._helloFilter, testFilter, new EndFilter()
                ];
        });
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
                this.setSender(sender);

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
