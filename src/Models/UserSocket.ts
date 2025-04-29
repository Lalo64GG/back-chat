import mongoose, {Schema} from "mongoose";
import IUserSocket from "../Interfaces/InterfaceModels/IUserSocket";

const userSocketSchema = new Schema<IUserSocket> ({
        socketId: {type: String, unique: true}, 
        lastSeen: { type: Date, default: Date.now },
        lastMessageDate: Date,
        lastContactId: { type: Schema.Types.ObjectId, ref: 'Contact' 
}
});

export const UserSocket = mongoose.model<IUserSocket>('UserSocket', userSocketSchema);