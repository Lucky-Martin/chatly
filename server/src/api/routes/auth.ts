import { Router } from 'express';
import { isAuth } from '../middleware/isAuth';
import {getUser, loginUser, signupUser, updateUser} from "../controllers/authController";

const router: Router = Router();
router.get('/status', isAuth, (req, res) => {
    res.status(200).json({ message: 'Authorized', user: (req as any).user});
});

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.patch('/profile', isAuth, updateUser)
router.get('/profile', isAuth, getUser);

router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
});

export { router as authRouter }
