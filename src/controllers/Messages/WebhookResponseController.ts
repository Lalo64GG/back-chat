import { Request, Response } from "express"
import twilio from "twilio"
import { savedMessage } from "../../socket/messages/savedMessage"
import { addContact } from "../Contacts/ContactsControllers"
import { emitMessage } from "../../socket/socket"
import { WelcomeMessageService } from "./WelcomeMessage"
import { analyzeMessageWithAI } from "../../services/IAService"

export const webhookStatus = (req: Request, res: Response) => {
  //procesar los estados de los mensajes
  res.sendStatus(200)
}

export const recivedMessage = async (req: Request, res: Response) => {
  const twiml = new twilio.twiml.MessagingResponse();
  try {
    const {
      Body: incomingMsg,
      From
    } = req.body;

    const { idDocument, name } = await addContact(From);

    if (idDocument && incomingMsg) {
      const isNewContact = await WelcomeMessageService.isNewContact(idDocument.toString());
    
      let messageCategory = null;
    
      if (!isNewContact) {
        messageCategory = await analyzeMessageWithAI(incomingMsg);
      }
    
      const result = await savedMessage(
        incomingMsg,
        idDocument,
        'recived',
        name,
      );
    
      if (result[0]) {
        emitMessage('newMesssage', result[0].timestamp.toISOString(), idDocument.toString(), [result[0]]);
    
        if (isNewContact) {
          await WelcomeMessageService.sendWelcomeMessage(From, idDocument.toString());
        } else {
          await WelcomeMessageService.sendCategorizedResponse(From, idDocument.toString(), messageCategory ?? '');
        }
      }
    }
    

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());

  } catch (error) {
    console.error("Error processing received message:", error);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }
}