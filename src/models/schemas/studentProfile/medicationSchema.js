const mongoose = require("mongoose");

const { Schema } = mongoose;

const medicationSchema = new Schema(
  {
    name: { type: String, trim: true, lowercase: true },
    dosage: { type: String, trim: true, lowercase: true },
    frequency: { type: String, trim: true, lowercase: true },
  },
  { _id: false }
);

module.exports = medicationSchema;
