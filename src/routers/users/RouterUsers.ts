import { Router } from "express";
import * as UserCtrl from "../../controllers/Users/UserControllers"
import * as VeryField from "../../middlewares/Users/VeryField"
const router = Router();

router.post('/v1',[VeryField.addUser], UserCtrl.addUser);
router.get('/v1/:id', UserCtrl.getUserId);

export default router;