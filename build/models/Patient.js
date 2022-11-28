const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const patientSchema = new Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    readings: {
        type: []
    },
    physician: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Physician'

    }

});


module.exports = mongoose.model('Patient', patientSchema);
