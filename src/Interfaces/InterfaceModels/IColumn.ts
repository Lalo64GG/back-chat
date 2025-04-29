import { Document, Types } from "mongoose";

export interface IColumn extends Document {
    name: string;
    board: Types.ObjectId;
}