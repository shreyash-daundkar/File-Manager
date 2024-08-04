import { Router } from 'express';
import { login, signUp } from '../controllers/auth';


const authRouter: Router = Router();


authRouter.post('/signup', signUp);

authRouter.post('/login', login);



export default authRouter;