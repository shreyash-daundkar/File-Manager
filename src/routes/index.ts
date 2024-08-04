import { Router } from 'express';
import authRouter from './auth';
import authMiddleware from '../middlewares/auth';
import folderRouter from './folder';
import fileRouter from './file';


const indexRouter: Router = Router();


indexRouter.use('/auth', authRouter);

indexRouter.use('/folder', authMiddleware, folderRouter);

indexRouter.use('/file', authMiddleware, fileRouter);


export default indexRouter;