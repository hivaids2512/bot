var mongoose = require('mongoose');
var botschema = require('./schema/bot');
var buttonFilterSchema = require('./schema/buttonFilter');

mongoose.connect('mongodb://quy2512:quy2512@ds023674.mlab.com:23674/tranquy_chatbot');

botschema.find({ "_id": "57716765659a7f917bf2f0f1" }, function(err, result) {
	console.log(result)
});

var newFilter = buttonFilterSchema({
	title : "Chào bạn, mềnh là bot tôi đi code dạo ^_^. Bạn thích đọc gì nào?",
	keywords : ["abc", "cba", "abc"],
	output : [{title: 'Nâng cao trình độ', type: 'POSTBACK', payload: 'custom'}, { title: 'Tìm hiểu nghề nghiệp',type: 'POSTBACK' , payload: 'custom2' }],
	botid : "57716765659a7f917bf2f0f1",
	payload : [{ payload : 'custom' , 'postback' : 'keyword_postback'}, { payload : 'custom2' , 'postback' : 'keyword_postback2'}],
});

buttonFilterSchema.find({ "botid" : "57716765659a7f917bf2f0f1" }, function(err, result){
	console.log(result);
})