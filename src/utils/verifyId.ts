import mongoose from "mongoose";

const verifyId = (id: string): boolean => {
    const isValidObjectId = mongoose.Types.ObjectId.isValid;
    return isValidObjectId(id)

}


export default verifyId;