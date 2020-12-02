const mongoose = require('mongoose'),
  Schema = mongoose.Schema

const Valuate = new Schema({
    //user related
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    processed: {type:Boolean, default:false},
    //house related
    coordinate: {lat:Number,lng:Number},
    buildingType: String,
    age:Number,
    floor: Number,
    //valuate related
    similar: [{ type: Schema.Types.ObjectId, ref: 'House' }],
    avgPrice: Number,
    manualPrice: Number
})

module.exports = mongoose.model('Valuate', Valuate)
