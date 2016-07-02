// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var buttonSchema = require('./button');
// create a schema
var buttonFilterSchema = new Schema({
  title : String ,
  keywords : [String],
  output : [Schema.Types.Mixed],
  botid : String,
  payload : [Schema.Types.Mixed],
});

// the schema is useless so far
// we need to create a model using it
var buttonFilter = mongoose.model('buttonFilter', buttonFilterSchema);

// make this available to our users in our Node applications
module.exports = buttonFilter;