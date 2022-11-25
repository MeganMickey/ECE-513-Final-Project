const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Reading = require('./Reading');
const Patient = require('.Patient');


const physicianSchema = new Schema({

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    patients: {type: [Patient]}

});



module.exports = mongoose.model("Physician", physicianSchema);
