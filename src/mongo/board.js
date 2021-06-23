const mongoose = require('mongoose');

const BoardSchema= new mongoose.Schema({
    postits: [{
        text:String,
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        x:String,
        y:String

    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    editor:[{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    }]



})

const Board = mongoose.model('Board',BoardSchema);
module.exports = Board