import { Request, Response, NextFunction } from "express"
import doesContactExist from "../../utils/DoesContactExist";
import verifyId from "../../utils/verifyId";
import IRequesContact from "../../Interfaces/DTOS/Contact/RequestContact";

export const AddContact = async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, countryCode }: IRequesContact = req.body;

    if (!name || !phone || !countryCode) {
        return res.status(400).json({
            success: false,
            message: "Faltan campos obligatorios o algunos campos están vacíos. Por favor, verifica y envía toda la información requerida."

        })
    }

    if (await doesContactExist(phone)) {
        return res.status(409).json({
            success: false,
            message: "El dato proporcionado ya existe. Por favor, utiliza un valor único."
        })
    }

    next();

}


export const UpdateContactByName = (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body as {name: string};
        const { id } = req.params as {id: string};

    if(!name || !id){
        return res.status(400).json({
            success: false,
            message: "Faltan campos obligatorios o algunos campos están vacíos Por favor, verifica y envía toda la información requerida."

        })
    }

    if (!verifyId(id)) {
        return res.status(422).json({
            success: false,
            message: "Id invalido"
        })
    }

    next();
}

export const UpdateStatusContact = (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body as {status: boolean};
    const { id } = req.params as {id: string};

    if(!status || !id){
        return res.status(400).json({
            success: false,
            message: "Faltan campos obligatorios o algunos campos están vacíos Por favor, verifica y envía toda la información requerida."

        })
    }

    if (!verifyId(id)) {
        return res.status(422).json({
            success: false,
            message: "Id invalido"
        })
    }

    next();
}

export const deleteContact = (req: Request, res:Response, next: NextFunction) => {

    const {id} = req.params as {id: string};
        
    if(!id){
        return res.status(400).json({
            success: true,
             message: "Es obligatorio mandar la id del usuario"
            })
    }

    if (!verifyId(id) ) {
        return res.status(422).json({
            success: false,
            message: "Id invalido"
        })
    }

    next();
}