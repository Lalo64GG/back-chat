import mongoose, { Schema } from "mongoose";
import { IBoard } from "../Interfaces/InterfaceModels/IBoard";

const boardSchema = new Schema<IBoard>({
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    columns: [{ type: Schema.Types.ObjectId, ref: "Column" }]
});

export const Board = mongoose.model<IBoard>("Board", boardSchema);
