import mongoose, { Schema } from "mongoose";
import IMessage from "../Interfaces/InterfaceModels/IMessage";

const messageSchema = new Schema<IMessage>({
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['recived', 'send'],
        required: true
    }
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);
