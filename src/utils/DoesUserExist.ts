import { User } from "../Models/UserSchema";

const doesUserExist = async (email: string): Promise<boolean> => {
    const user = await User.findOne({ email });
    return Boolean(user)
}

export default doesUserExist;