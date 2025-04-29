import {Router} from 'express';
import  * as MessageControllers from "../../controllers/Messages/MessagesControllers"
import {webhookStatus, recivedMessage} from "../../controllers/Messages/WebhookResponseController"
import * as VerifyField from "../../middlewares/Message/VeryField"
const router = Router();

router.post('/v1/template',[VerifyField.sendTemplateMessage],MessageControllers.sendTemplateMessage);
router.get('/v1/all/:id', MessageControllers.MessagesByContact);
router.post('/v1/webhook/status', webhookStatus)
router.post('/v1/webhook/received/message', recivedMessage)


export default router;