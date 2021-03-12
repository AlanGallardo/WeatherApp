const mongoose = require('mongoose');
const { Schema } = mongoose;

const Place = new Schema({
    name : String,
    temp : Number,
    icon : String,
});

module.exports = mongoose.model('Place', Place);