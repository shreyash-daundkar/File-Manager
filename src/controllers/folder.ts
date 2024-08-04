import { Request, Response, NextFunction } from "express";
import { createFolder, deleteFolder, readAllSubFolderByParentFolderId, readFolderByFolderName, readRootFolderByUserId, updateFolderName } from "../services/folder";
import { ConflictException, InternalException, NotFoundException } from "../errors/exceptions";
import { addFolderValidation } from "../validations/folder";


export const addFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {

        addFolderValidation.parse(req.body);

        const { name, userId } = req.body;

        const parentFolderId = +req.params.parentFolderId ? +req.params.parentFolderId : null;
        

        const foldersWithSameName = await readFolderByFolderName(name, parentFolderId);

        if(!foldersWithSameName) {
            throw new Error('Error fetching folder');
        }

        if(foldersWithSameName.length > 0) return next(
            new ConflictException('Folder with same name exist in Current folder', null)
        );
   
        const folder = await createFolder({
            name, 
            userId, 
            parentFolderId,
        });
    
        if(!folder) {
            throw new Error('Error creating folder');
        }
    
        return res.status(201).json({
            message: 'Folder created successfully', 
            data: folder,
            success: true,
        });
        
    } catch (error) {
        return next(new InternalException(error));
    }
};


export const getAllSubFolderByParentFolderId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { parentFolderId } = req.params;
   
        const folders = await readAllSubFolderByParentFolderId(+parentFolderId);
    
        if(!folders) {
            throw new Error('Error getting folder');
        }

        if(folders.length === 0) {
            return next( new NotFoundException('Folder is Empty', null));
        }
    
        return res.status(200).json({
            message: 'Fetched all folders successfully', 
            data: folders,
            success: true,
        });
        
    } catch (error) {
        return next(new InternalException(error));
    }
};


export const getRootFolderByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;
   
        const folders = await readRootFolderByUserId(userId);
    
        if(!folders) throw new Error('Error getting folder');

        if(folders.length === 0) return next( 
            new NotFoundException('No root folder found', null)
        );
    
        return res.status(200).json({
            message: 'Fetched all folders successfully', 
            data: folders,
            success: true,
        });
        
    } catch (error) {
        return next(new InternalException(error));
    }
};


export const renameFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        addFolderValidation.parse(req.body);

        const { name, parentFolderId } = req.body;
        const folderId = +req.params.folderId;
        
        const foldersWithSameName = await readFolderByFolderName(name, parentFolderId);

        if(!foldersWithSameName) throw new Error('Error fetching folder');

        if(foldersWithSameName.length > 0) return next(
            new ConflictException('Folder with same name exist in Current folder', null)
        );
   
        const folder = await updateFolderName(folderId, name);
        if(!folder) throw new Error('Error renaming folder');
    
        return res.status(200).json({
            message: 'Folder renamed successfully', 
            data: folder,
            success: true,
        });
        
    } catch (error) {
        return next(new InternalException(error));
    }
};


export const removeFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const folderId = +req.params.folderId;
   
        const folder = await deleteFolder(folderId);
        if(!folder) throw new Error('Error deleting folder');
    
        return res.status(200).json({
            message: 'Folder deleted successfully', 
            data: folder,
            success: true,
        });
        
    } catch (error) {
        return next(new InternalException(error));
    }
};