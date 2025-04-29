import { ObjectId } from "mongoose";

export default interface IUserSocket {
    socketId: string,
    lastSeen: Date,
    lastMessageDate: Date,
    lastContactId: ObjectId
}