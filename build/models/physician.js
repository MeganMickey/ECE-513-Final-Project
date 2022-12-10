const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const physicianSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    // Username storage
    email: {
        type: String,
        required: true
    },
    // Password storage.
    passwordHash: {
        type: String,
        required: true
    },
    //When was the last access?
    lastAcces: {
        type: Date
    },
    // The Physician stores an array of patients
    patients: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient'
        }]
    }

});


module.exports = mongoose.model("Physician", physicianSchema);
