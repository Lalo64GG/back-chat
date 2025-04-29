import {Types, Document} from "mongoose";

export default interface IMessage extends Document {
    contactId: Types.ObjectId;
    content: string;
    timestamp: Date;
    status: 'recived' | 'send'
  }