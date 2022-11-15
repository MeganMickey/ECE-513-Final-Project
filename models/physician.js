const db = require("../db");

const physicianSchema = new db.Schema({

 });


const Physician = db.model("Physician", physicianSchema);

module.exports = Physician;
