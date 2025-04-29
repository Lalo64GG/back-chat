import { Message } from "../../Models/IMessages";
import { Contact } from "../../Models/ContactSchema";
import IResponseMessage from "../../Interfaces/DTOS/Message/IResponseMessage";

export const MessagesByContact = async (id: string): Promise<[IResponseMessage[] | null, number, string]> => {
    try {
        const contact = await Contact.findById(id);

        if (!contact) {
            return [null, 404, new Date().toISOString()];
        }

        const messages = await Message.find({ contactId: id })
            .select('_id contactId content timestamp status')
            .populate({
                path: 'contactId',
                select: 'name'
            });

        if (!messages || messages.length === 0) {
            return [null, 200, new Date().toISOString()];
        }

        
        const sendData: IResponseMessage[] = messages.map(message => ({
            id: message.id,
            contactId: {
                _id: message.contactId._id.toString(),  
                name: (message.contactId as any).name 
            },
            content: message.content,
            timestamp: message.timestamp,
            status: message.status
        }));

        return [sendData, 200, new Date().toISOString()];
    } catch (error) {
        console.log('Error fetching messages:', error);
        return [null, 500, new Date().toISOString()];
    }
}
