const mongoose = require("mongoose");

const { Schema } = mongoose;

const medicalCertificateSchema = new Schema(
  {
    label: { type: String, trim: true, lowercase: true },
    file_url: { type: String, trim: true },
    uploaded_at: { type: Date, default: Date.now },
  },
  { _id: false }
);

module.exports = medicalCertificateSchema;
