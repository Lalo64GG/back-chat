import {Router} from "express"
import AuthController from "../../controllers/Auth/AuthController";
const router = Router();

router.post('/access', AuthController.access);
router.post('/logout', AuthController.logout);
router.post('/refresh', AuthController.refresh);
router.post('/password-reset', AuthController.requestPasswordReset);
router.post('/password-reset/:token', AuthController.resetPassword);

export default router;