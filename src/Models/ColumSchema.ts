import mongoose, { Schema } from "mongoose";
import { IColumn } from "../Interfaces/InterfaceModels/IColumn";

const columnSchema = new Schema<IColumn>({
    name: { type: String, required: true },
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true } 
});

export const Column = mongoose.model<IColumn>("Column", columnSchema);
