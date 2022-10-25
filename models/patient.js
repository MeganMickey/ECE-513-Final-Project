const db = requre("../db");

const patientSchema = new db.Schema({

});

const Patient = db.model("Patient", patientSchema);

module.exports = Patient;
