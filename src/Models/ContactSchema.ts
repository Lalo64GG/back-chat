import mongoose, { Schema } from "mongoose";
import IContact from "../Interfaces/InterfaceModels/IContact";

const contactSchema = new Schema<IContact>({
  name: { type: String },
  phone: { type: String, required: true },
  countryCode: { type: String, required: true },
  status: { type: String, default: "New" }
}, {
  timestamps: true
});

export const Contact = mongoose.model<IContact>('Contact', contactSchema);
