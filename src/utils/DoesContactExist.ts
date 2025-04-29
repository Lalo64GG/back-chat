import { Contact } from "../Models/ContactSchema";

const doesContactExist = async (phone: string): Promise <boolean> => {
    const user = await Contact.findOne({ phone });
    return Boolean(user)
}

export default doesContactExist;