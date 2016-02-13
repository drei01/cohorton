var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// Event model
var Event = new Schema({
  user_id : String,
  user_joined_at : { type: Date },
  via : String,
  event : String,
  created_at: { type: Date, default: Date.now },
  info: {}
},{
  toObject: { getters: true }
});

//Unique index on user,event and source
Event.index({ user_id: 1, event: 1, via: 1 }, { unique: true });

module.exports = mongoose.model('Event', Event);