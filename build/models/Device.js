const {Int32} = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const deviceSchema = new Schema({

    deviceID: {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    // start time
    startTime: {
        type: Int32,
        require: true
    },
    endTime: {
        type: Int32,
        require: true
    },
    intervalTime: {
        type: Int32,
        require: true
    }


});


// Then, when you make your query, you can populate references like this:

// Post.findOne({_id: 123})
// .populate('postedBy')
// .exec(function(err, post) {
//     // do stuff with post
// });


module.exports = mongoose.model("Device", deviceSchema);
