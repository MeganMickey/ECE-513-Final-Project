const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const patientSchema = new Schema({
    // First Name
    name: {
        type: String,
        required: true
    },
    // Username storage.
    username: {
        type: String,
        required: true
    },
    // Password hash storage.
    passwordHash: {
        type: String,
        required: true
    },
    // Including an array of readings for the patient.
    readings: {
        type:
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Reading'
            }]
    },
    // The patient has a physician.
    physician: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Physician'

    }

});


module.exports = mongoose.model('Patient', patientSchema);
