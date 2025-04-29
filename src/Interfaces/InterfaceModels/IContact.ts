import { Document} from "mongoose";

export default interface IContact extends Document {
    name: string;
    phone: string;
    countryCode: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}