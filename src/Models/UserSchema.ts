import 'dotenv/config'
import mongoose, { Schema } from "mongoose";
import IUsers from "../Interfaces/InterfaceModels/IUsers";


const userSchema = new Schema<IUsers>({
    name: { type: String, required: true },
    surnameP: { type: String, required: true },
    surnameM: { type: String, required: true },
    birthDate: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true},
    countryCode: { type: String, required: true }
})


export const User = mongoose.model<IUsers>('User', userSchema);
