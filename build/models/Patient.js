const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Physician = require('./Physician');
const Reading = require('./Reading');



const patientSchema = new Schema({

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    readings: { type: [Reading] },
    physician: { type: Physician }

});


module.exports = mongoose.model('Patient', patientSchema);
