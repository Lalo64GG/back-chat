import "dotenv/config";
import twilioService from "../../config/Twilio/TwilioConexion";
import RequestMessage from "../../Interfaces/DTOS/Message/RequestMessage";
import IResponseMessage from "../../Interfaces/DTOS/Message/IResponseMessage";
import { savedMessage } from "./savedMessage";

export const SendMessage = async (
  data: RequestMessage
): Promise<{ result: IResponseMessage | boolean; serverOffset: string }> => {
  try {

    const fullphoneNumber = `${data.countryCode}${data.phone}`;
    const sidServiceMessage = process.env["TWILIO_SID_SERVICE_MESSAGE"];
    const phoneTwilio = process.env["TWILIO_PHONE_NUMBER"];

    if (!fullphoneNumber || !sidServiceMessage) {
      throw new Error(
        "Nose pudo cargar las variables de entorno del servicio de mensajeria"
      );
    }

    if (!data) throw new Error("no se ah mandado ningun dato");

    await twilioService.messages.create({
      body: data.message,
      from: `whatsapp:${phoneTwilio}`,
      to: `whatsapp:${fullphoneNumber}`,
    });

    const result = await savedMessage(data.message, data.id, "send", data.name);

    if (result[0] === null) {
      return {
        result: result[1],
        serverOffset: new Date().toISOString(),
      };
    }

    return {
      result: result[0],
      serverOffset: result[0].timestamp.toISOString(),
    };
  } catch (error) {
    if (error instanceof Error){
      console.log("Error al enviar mensaje", error.message);
    }
      return { result: false, serverOffset: new Date().toISOString() };
    
  }
};
