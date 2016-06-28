// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var botSchema = new Schema({
  accesstoken : { type: String}
});

// the schema is useless so far
// we need to create a model using it
var bot = mongoose.model('bot', botSchema);

// make this available to our users in our Node applications
module.exports = bot;