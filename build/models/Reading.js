const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const readingSchema = new Schema({

    time: {
        type: Date,
        required: true
    },
    heartRate: {
        type: Number,
        required: true
    },
    bloodOxygen: {
        type: Number,
        required: true  
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }

});


// Then, when you make your query, you can populate references like this:

// Post.findOne({_id: 123})
// .populate('postedBy')
// .exec(function(err, post) {
//     // do stuff with post
// });


module.exports = mongoose.model("Reading", readingSchema);
