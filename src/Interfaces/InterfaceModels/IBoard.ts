import { Document, Types } from "mongoose";

export interface IBoard extends Document {
    name: string;
    owner: Types.ObjectId;
    columns: string[];
}