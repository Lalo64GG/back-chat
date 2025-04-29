import {Request, Response, NextFunction} from "express"
import RequestTemplateMessages from "../../Interfaces/DTOS/Message/RequestTemplateMessage";

export const sendTemplateMessage = (req: Request, res:Response, next: NextFunction) => {
    const {countryCode, name, phone}: RequestTemplateMessages = req.body;

    if (!countryCode || !name || !phone){
        return res.status(400).json({
            success: false,
            message: `Faltan campos obligatorios o algunos campos están vacíos. Por favor, verifica y envía toda la información requerida.`
        })
    }

    next();

}