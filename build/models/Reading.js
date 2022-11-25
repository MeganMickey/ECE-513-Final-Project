const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Physician = require('./Physician');
const Patient = require('./Patient');


const readingSchema = new Schema({

    time: { type: Date, required: true },
    heartRate: { type: Number, required: true },
    patient: { type: Patient, required: true }

});



module.exports = mongoose.model("Reading", readingSchema);
