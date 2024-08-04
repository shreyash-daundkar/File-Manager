import { Router } from 'express';
import { folderPermissionMiddleware, parentPermissionMiddleware } from '../middlewares/permission';
import { addFolder, getAllSubFolderByParentFolderId, getRootFolderByUserId, removeFolder, renameFolder } from '../controllers/folder';


const folderRouter: Router = Router();


folderRouter.post('/', addFolder);

folderRouter.get('/', getRootFolderByUserId);

folderRouter.post('/:parentFolderId', parentPermissionMiddleware, addFolder);

folderRouter.get('/:parentFolderId', parentPermissionMiddleware, getAllSubFolderByParentFolderId);

folderRouter.put('/:folderId', folderPermissionMiddleware, renameFolder);

folderRouter.delete('/:folderId', folderPermissionMiddleware, removeFolder);


export default folderRouter;