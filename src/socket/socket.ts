import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "node:http";
import { Socket } from "socket.io";
import RequestMessage from "../Interfaces/DTOS/Message/RequestMessage";
import { SendMessage } from "./messages/sendMessages";
import { Message } from "../Models/IMessages";
import { MessagesByContact } from "./messages/getMessages";
import IResponseMessage from "../Interfaces/DTOS/Message/IResponseMessage";
import IResponseContact from "../Interfaces/DTOS/Contact/ResponseContact";
import getContacs from "./contact/getContacts";

let io: SocketIOServer;



const setUpWebsocket = (server: HTTPServer) => {

     io = new SocketIOServer(server,{
        cors: {
            origin: '*',
            
        },
        connectionStateRecovery: {}
        
    });


    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth.token as string; 
      
        if (!token) {
            return next(new Error('Invalid Token'));
        }
        
        next();

    });

    
    io.on("connect", async (socket) => {
        console.log("un usuario se ah conectado");

        socket.on('disconnect', () => {
            console.log('un usuario se ah desconectado')
          })
    
        socket.on("sendMessage", async (data:RequestMessage) => {
            
           const {result, serverOffset } = await SendMessage(data)
           

            if (!result){
                console.log('no se pudo enviar el mensage con twilio')
                socket.emit('error', { message: 'hubo un error al intentar enviar el mensaje' });
                return;
            } 

            io.emit('private_message', serverOffset,data.id, [result]);

        });

    
        socket.on('getMessage', async (idContact: string) => {
           try {
       
            const result = await MessagesByContact(idContact);
            if (result[1] === 404){
                socket.emit('error', { message: 'Contacto no encontrador' });
                return
            } else if (result[1] === 200 && result [0] === null){
                socket.emit('error', { message: 'no hay ningun mensaje para dicho contacto' }); 
                return
            }

            io.emit('private_message', result[2], idContact, result[0])

           } catch (error) {
            console.log(error)
            socket.emit('error', { message: 'hubo un error en el servidor' });
            return
           }
            

        });

        socket.on('getContacts',  async () => {
              
            try {
            const result = await getContacs();
            if (result[1] === 500){
                socket.emit('error', { message: 'hubo un error al cargar los mensajes' });
            }
                socket.emit('contacts', result[0]);
            } catch (error) {
                socket.emit('error', { message: 'hubo un error en el servidor' });
            }
        });

        if (!socket.recovered) {
            try {
                const serverOffset = socket.handshake.auth.serverOffset as string;
                const idContact = socket.handshake.auth.idContact as string
                
                console.log({
                    serverOffset
                })

                if (!serverOffset || !idContact) {
                    socket.emit('error', { message: 'error de auntentificación ' });
                    return;
                }
                
                const messages = await Message.find({
                    contactId: idContact,
                    timestamp:{$gt: serverOffset}
                }).sort({ timestamp: 1 });
            
                
                messages.forEach(msg => {
                    socket.emit('private_message',  msg.timestamp.toISOString() , idContact, msg )
                })
        

            } catch (error) {
                socket.emit('error', { message: 'hubo un error al recuperar los datos' });
                console.log(error)

            }
        }

        
         
    });
};

export const emitMessage = (event: string, serverOffset: string, idContact: string,  data: [IResponseMessage]) => {
    if (io){
        io.emit(event, serverOffset, idContact,  data)
    } else{
        console.log('websocket no inicalizado')
    }
}

export const emitContact = (event: string, data: [IResponseContact]) => {
    if (io){
        io.emit(event, data)
    } else{
        console.log('websocket no inicalizado')
    }
}

export default setUpWebsocket;