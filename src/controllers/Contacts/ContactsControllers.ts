import { Request, Response } from "express"
import { Contact } from "../../Models/ContactSchema";
import extractPhoneComponent from "../../utils/ExtractPhoneComponents";
import IMessageStatus from "../../Interfaces/DTOS/Message/IMessageStatus";
import IResponseContact from "../../Interfaces/DTOS/Contact/ResponseContact";
import IRequesContact from "../../Interfaces/DTOS/Contact/RequestContact";
import { emitContact } from "../../socket/socket";

export const addContact = async (requestPhoneNumber: string): Promise<IMessageStatus> => {
    try {
        if (!requestPhoneNumber) {
            return { message: "No se ah enviado el numero telefonico", status: false }
        }

        const { countryCode, phone } = extractPhoneComponent(requestPhoneNumber);
        const result = await Contact.findOne({ phone });

        if (result) {
            return {
                message: 'Contacto existente',
                status: true,
                idDocument: result.id,
                name: result.name
            }
        }

        const newContact = new Contact({
            countryCode,
            phone,
            name: `${countryCode} ${phone}`
        });

        const data = await newContact.save();

        emitContact('newContact',[{
            _id: data.id,
            name: data.name,
            phone: data.phone,
            countryCode: data.countryCode
        }]);
        
        return {
            message: 'Se ha guardado correctamente, el nuevo contacto',
            status: true,
            idDocument: data.id,
            name: data.name
        }


    } catch (error) {
        console.log('ha ocurrido un error', error);
        return { message: 'Error en el servidor', status: false }
    }


}

export const getContacts = async (req: Request, res: Response) => {
    try {
        const result: Array<IResponseContact> = await Contact.find().select('_id name phone countryCode status');
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Hubo un error en la consulta"
        });
    }
}

export const updateContactByName = async (req: Request, res: Response) => {
    try {
        const { name } = req.body as {name: string};
        const { id } = req.params as {id: string};

        await Contact.findByIdAndUpdate(id, { name }, { new: true });

        return res.status(200).json({
            sucess: true,
            message: "Se actualizo correctamente",
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'hubo un error al actualizar el mensaje'
        })
    }
}

export const UpdateStatusContact = async ( req: Request, res: Response) => {

    console.log(req.body)

    try {
        const { id } = req.params as {id: string};
        const { status } = req.body as {status: string};

        await Contact.findByIdAndUpdate(id, { status }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Se actualizo correctamente"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Hubo un error al actualizar el mensaje"
        })
    }
}


export const AddNewContact = (req: Request, res: Response) => {
    try {
        const { name, phone, countryCode }:IRequesContact  = req.body;

        const newContact = new Contact({
            name,
            phone,
            countryCode
        })

        newContact.save();

        emitContact('newContact',[{
            _id: newContact.id,
            name: newContact.name,
            phone: newContact.phone,
            countryCode: newContact.countryCode
        }]);

        return res.status(201).json({
            success: true,
            message: 'Se ah añadido un nuevo contacto'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Hubo un error al añadir un nuevo contacto"
        })
    }
} 

export const deleteContact = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as {id: string};

        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({
                success: false,
                message: "Contacto no encontrado"
            });
        }

        return res.sendStatus(204);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "hubo un error al intentar realizar tu petición"
        });

    }
}


