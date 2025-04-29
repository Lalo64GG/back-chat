import { ObjectId } from "mongoose";

export default  interface IResponseContact {
    _id: ObjectId,
    name: string,
    phone: string,
    countryCode: string,
    createdAt?: Date
}