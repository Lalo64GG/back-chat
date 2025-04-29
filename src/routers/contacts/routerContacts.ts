import { Router } from "express";
import * as CtrlContacts from "../../controllers/Contacts/ContactsControllers"
import * as VeryFields from "../../middlewares/Contacts/VerifyFields"
import veryfyToken from "../../middlewares/auth/authJwt";

const router = Router();

// router.get('/v1',[veryfyToken], CtrlContacts.getContacts);
router.get('/v1',CtrlContacts.getContacts);
router.patch('/v1/:id',[VeryFields.UpdateContactByName],CtrlContacts.updateContactByName);
router.patch('/v1/status/:id',[VeryFields.UpdateStatusContact],CtrlContacts.UpdateStatusContact);
router.post('/v1',[VeryFields.AddContact], CtrlContacts.AddNewContact);
router.delete('/v1/:id',[VeryFields.deleteContact], CtrlContacts.deleteContact);

export default router;

