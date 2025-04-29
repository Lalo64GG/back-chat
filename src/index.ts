import dotenv from "dotenv";
dotenv.config();
import '../src/config/ConexionDatabase/ConexionDatabase';
import express from "express";
import routerMessages from "./routers/messages/routerMessages";
import routerContacts from './routers/contacts/routerContacts';
import routerUsers from './routers/users/RouterUsers';
import routerAuth from "./routers/auth/routerAuth"
import routerBoard from "./routers/board/routerBoard"
import routerColumn from "./routers/column/routerColumn"
import bodyParser from "body-parser"
import {createServer} from "node:http"
import configurarWebsocket  from './socket/socket';
import cors from "cors"
import cookies from "cookie-parser";
import authJwt from './middlewares/auth/authJwt';

const PORT = process.env['Port'] || 3000;
const app = express();
const server = createServer(app);


const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true, 
  optionsSuccessStatus: 200
};


app.use(cookies());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions)); 


app.use('/messages', routerMessages);
app.use('/contacts', routerContacts);
app.use('/users', routerUsers);
app.use('/auth', routerAuth);
app.use('/board', routerBoard);
app.use('/column', routerColumn);


app.options('*', cors(corsOptions));


configurarWebsocket(server);

server.listen(PORT, () => {
    console.clear();
    console.log(`Server listening in http://localhost:${PORT}`);
    console.log(`CORS enabled for origins: ${corsOptions.origin.join(', ')}`);
})