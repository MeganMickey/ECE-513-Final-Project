const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const physicianSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    // Username storage
    username: {
        type: String,
        required: true,
        min: 1,
        max: 1
    },
    // Password storage.
    passwordHash: {
        type: String,
        required: true
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
