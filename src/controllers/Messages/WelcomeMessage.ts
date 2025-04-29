import { Message } from "../../Models/IMessages";
import { SendMessage } from "../../socket/messages/sendMessages";
import { emitMessage } from "../../socket/socket";
import IResponseMessage from "../../Interfaces/DTOS/Message/IResponseMessage";
import RequestMessage from "../../Interfaces/DTOS/Message/RequestMessage";

export class WelcomeMessageService {

    static async isNewContact(contactId: string): Promise<boolean> {
        const messageCount = await Message.countDocuments({ contactId });
        return messageCount <= 1;
    }

    static getMessageByCategory(category: string): string {
        switch (category.toLowerCase()) {
            case 'hablar con operador':
                return "En breve uno de nuestros operadores se comunicará contigo para atender tu consulta personalmente. ¿Hay algo específico en lo que podamos ayudarte mientras tanto?";
            
            case 'cotizar desarrollo':
                return "Gracias por tu interés en nuestros servicios de desarrollo. Para ofrecerte una cotización precisa, ¿podrías decirnos más sobre tu proyecto? (tipo de aplicación, funcionalidades principales, plazos, etc.)";
            
            case 'información producto':
                return "Gracias por tu interés en nuestros productos. Para brindarte información detallada, ¿podrías especificar qué producto o servicio te interesa?";
            
            case 'otro':
            default:
                return "Hemos recibido tu mensaje. ¿Podrías darnos más detalles sobre cómo podemos ayudarte?";
        }
    }

    static async sendWelcomeMessage(from: string, contactId: string, messageCategory?: string): Promise<void> {
        const phoneNumber = from.replace('whatsapp:', '').replace('+52', '');

        const welcomeMessage: RequestMessage = {
            id: contactId,
            phone: phoneNumber, 
            message: "¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte?\n\n" +
                    "1. Información sobre nuestros productos\n" +
                    "2. Cotizar desarrollo web/móvil\n" +
                    "3. Hablar con un operador\n\n" +
                    "Simplemente dinos lo que necesitas y te atenderemos de inmediato.",
            countryCode: "+52", 
            name: "Sistema"
        };

        try {
            const { result } = await SendMessage(welcomeMessage);
            
            if (result && typeof result !== 'boolean') {
                const responseMessage: IResponseMessage = {
                    id: contactId,
                    contactId: {
                        _id: contactId,
                        name: "Sistema"
                    },
                    content: welcomeMessage.message,
                    timestamp: result.timestamp instanceof Date 
                        ? result.timestamp 
                        : new Date(result.timestamp),
                    status: 'send'
                };
                
                emitMessage(
                    'private_message', 
                    responseMessage.timestamp.toISOString(),
                    contactId, 
                    [responseMessage]
                );
                
                if (messageCategory) {
                    setTimeout(() => {
                        this.sendCategorizedResponse(from, contactId, messageCategory);
                    }, 1000);
                }
            }
        } catch (error) {
            console.error("Error sending welcome message:", error instanceof Error ? error.message : error);
        }
    }
    
    static async sendCategorizedResponse(from: string, contactId: string, messageCategory: string): Promise<void> {
        const phoneNumber = from.replace('whatsapp:', '').replace('+52', '');
        
        const responseMessage: RequestMessage = {
            id: contactId,
            phone: phoneNumber,
            message: this.getMessageByCategory(messageCategory),
            countryCode: "+52",
            name: "Sistema"
        };
        
        try {
            const { result } = await SendMessage(responseMessage);
            
            if (result && typeof result !== 'boolean') {
                const autoResponseMessage: IResponseMessage = {
                    id: contactId,
                    contactId: {
                        _id: contactId,
                        name: "Sistema"
                    },
                    content: responseMessage.message,
                    timestamp: result.timestamp instanceof Date 
                        ? result.timestamp 
                        : new Date(result.timestamp),
                    status: 'send'
                };
                
                emitMessage(
                    'private_message', 
                    autoResponseMessage.timestamp.toISOString(),
                    contactId, 
                    [autoResponseMessage]
                );
            }
        } catch (error) {
            console.error("Error sending categorized response:", error instanceof Error ? error.message : error);
        }
    }
}