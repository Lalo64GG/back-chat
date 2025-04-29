import 'dotenv/config'
import { Request, Response } from "express";
import twilioService from "../../config/Twilio/TwilioConexion";
import { Message } from '../../Models/IMessages';
import { Contact } from '../../Models/ContactSchema';

export const sendTemplateMessage = async (req: Request, res: Response) => {
    try {
        const { phone, name, countryCode } = req.body;
        const fullphoneNumber = `${countryCode}${phone}`;

        const contentSidTemplate = process.env['TWILIO_SID_TEMPLATE'] || '';
        const sidServiceMessage = process.env['TWILIO_SID_SERVICE_MESSAGE'] || '';

        if (!contentSidTemplate || !sidServiceMessage) {
            return res.status(500).json({
                message: 'Configuración de Twilio incompleta'
            })
        }

        await twilioService.messages.create({
            contentSid: contentSidTemplate,
            contentVariables: JSON.stringify({ 1: name }),
            from: sidServiceMessage,
            to: `whatsapp:${fullphoneNumber}`,
        });

        return res.status(200).json({
            succes: true,
            message: 'Se ha enviado correctamente'
        });

    } catch (error) {
        console.log('Error al enviar mensaje', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
} //aun falta guardar los mensajes cuando se guarda por plantilla


export const MessagesByContact = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
    
        const contact =  await Contact.findById(id);
        if (!contact) {
             return res.status(404).json({
                 success: false,
                 message: "No se encontro ningun contacto"
             });
        }

        const result = await Message.find({ contactId: id })
            .select('-_id contactId content timestamp status')
            .populate({
                path: 'contactId',
                select: 'name'    
              });

             return res.status(200).json({
                 success: true,
                 data: result
             });

    } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: 'Hubo un error con tu consulta'
            })
    }
}
