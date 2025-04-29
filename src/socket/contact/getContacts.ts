import { Contact } from "../../Models/ContactSchema";
import IResponseContact from "../../Interfaces/DTOS/Contact/ResponseContact";


const getContacs =  async (): Promise<[Array<IResponseContact> | null , number]> => {
    try {
        const result: Array<IResponseContact> = await Contact.find().select('_id name phone countryCode status createdAt updatedAt');
        return [result, 200];
    } catch (error) {
        console.log(error)
        return  [null, 500]
    }
}

export default getContacs;