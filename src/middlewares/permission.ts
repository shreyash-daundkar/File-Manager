import { Request, Response, NextFunction } from "express";
import { InternalException, NotFoundException, UnauthorizedException } from "../errors/exceptions";
import { readFolderByFolderId } from "../services/folder";
import { readFileByFileId } from "../services/file";


export const parentPermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {   
        const { userId } = req.body;
        const { parentFolderId } = req.params;
        
        const folder = await readFolderByFolderId(+parentFolderId);
        if(!folder) return next(
            new NotFoundException('Parent folder not found', null)
        );

        if(folder.userId === userId) return next();
        
        return next(new UnauthorizedException('Permission denied', null));

    } catch (error) {
        next(new InternalException(error));
    }
}


export const filePermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {   
        const { userId } = req.body;
        const { fileId } = req.params;
        
        const file = await readFileByFileId(+fileId);
        
        if(!file) return next(
            new NotFoundException('file not found', null)
        );

        if(file.userId === userId) {
            req.body.parentFolderId = file.folderId;
            return next();
        }
        return next(new UnauthorizedException('Permission denied', null));

    } catch (error) {
        next(new InternalException(error));
    }
}


export const folderPermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {   
        const { userId } = req.body;
        const { folderId } = req.params;
        
        const folder = await readFolderByFolderId(+folderId);
        
        if(!folder) return next(
            new NotFoundException('folder not found', null)
        );

        if(folder.userId === userId) {
            req.body.parentFolderId = folder.parentFolderId;
            return next();
        }
        
        return next(new UnauthorizedException('Permission denied', null));

    } catch (error) {
        next(new InternalException(error));
    }
}