// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var buttonSchema = new Schema({
  title : String,
  type : String,
  payload : String,
});

// the schema is useless so far
// we need to create a model using it
var button = mongoose.model('button', buttonSchema);

// make this available to our users in our Node applications
module.exports = button;