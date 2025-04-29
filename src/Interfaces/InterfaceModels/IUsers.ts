import { Document } from "mongoose";

export default interface IUsers extends Document {
    name: string;
    surnameP: string;
    surnameM: string;
    birthDate: string;
    gender: string;
    email: string
    password: string,
    phone: string,
    countryCode: string,
}