import { filePermissionMiddleware } from './../middlewares/permission';
import { Router } from 'express';
import { parentPermissionMiddleware } from '../middlewares/permission';
import multerFileUpload from '../middlewares/multer';
import { addFile, getFilesByFolderId, moveFile, removeFile, renameFile } from '../controllers/file';
import authMiddleware from '../middlewares/auth';


const fileRouter: Router = Router();


fileRouter.get('/:parentFolderId', parentPermissionMiddleware, getFilesByFolderId);

fileRouter.post('/:parentFolderId', parentPermissionMiddleware, multerFileUpload, authMiddleware, addFile);

fileRouter.put('/:fileId/:parentFolderId', filePermissionMiddleware, parentPermissionMiddleware, moveFile);

fileRouter.put('/:fileId', filePermissionMiddleware, renameFile);

fileRouter.delete('/:fileId', filePermissionMiddleware, removeFile);


export default fileRouter;