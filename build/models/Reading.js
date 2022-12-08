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
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }

});



module.exports = mongoose.model("Reading", readingSchema);
