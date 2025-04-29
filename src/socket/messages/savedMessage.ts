import { Message } from '../../Models/IMessages';
import IResponseMessage  from '../../Interfaces/DTOS/Message/IResponseMessage';

 export const savedMessage = async (message: string, id: string, status: string, name: string | undefined): 
    Promise<[IResponseMessage | null ,boolean]> => {
    
     try {

         const newMessage = new Message({
             contactId: id,
             content: message,
             timestamp: new Date(),
             status
         });

       const result =  await newMessage.save();

         
        const send = {
            id: result.id,
            contactId: {
                _id: id,
                name: name ?? ''
            },
            content: result.content,
            timestamp: result.timestamp,
            status: result.status
         }


         return [send, true]

     } catch (error) {
         console.log(error)
         return [null, false]
     }
 }