import { Request, Response, NextFunction } from "express";
import { ConflictException, InternalException, NotFoundException, UnauthorizedException } from "../errors/exceptions";
import { createFile, deleteFile, readFileByFileId, readFileByFileName, readFilesByFolderId, updateFileName, updateFilesParentFolder } from "../services/file";
import { deleteFromS3, uploadToS3 } from "../services/awsS3";
import { readFolderByFolderId } from "../services/folder";


export const addFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;
        const parentFolderId = +req.params.parentFolderId;
        
        if(!req.file) return next(
            new NotFoundException('file not found', null)
        );
        
        const { originalname, buffer, mimetype, size} = req.file;

        const filesWithSameName = await readFileByFileName(originalname, parentFolderId);
        if(!filesWithSameName) throw new Error('Error fetching files');

        if(filesWithSameName.length > 0) return next(
            new ConflictException('File with same name exist in Current folder', null)
        );

        const result = await uploadToS3(originalname, buffer, mimetype);
        if(!result) return new Error('Error uploading to S3');

        const filedata = {
            name: originalname,
            folderId: parentFolderId,
            size: size,
            userId,
            url: result.Location,
            key: result.Key,
        }
        const file = await createFile(filedata);
        if(!file) throw new Error('Error creating file');
    
        return res.status(201).json({
            message: 'File created successfully', 
            data: file,
            success: true,
        });
        
    } catch (error) {
        return next(new InternalException(error));
    }
};


export const renameFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, parentFolderId } = req.body;
        const fileId = +req.params.fileId;
    
        const filesWithSameName = await readFileByFileName(name, parentFolderId);
        if(!filesWithSameName) throw new Error('Error fetching files');

        if(filesWithSameName.length > 0) return next(
            new ConflictException('File with same name exist in Current folder', null)
        );
   
        const file = await updateFileName(fileId, name);
        if(!file) throw new Error('Error updating file');
    
        return res.status(200).json({
            message: 'File renamed successfully', 
            data: file,
            success: true,
        });
        
    } catch (error) {
        return next(new InternalException(error));
    }
};


export const removeFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fileId = +req.params.fileId

        const file = await deleteFile(fileId);
        if(!file) throw new Error('Error deleting file');

        const deleted = await deleteFromS3(file.key);
        if(!deleted) throw new Error('Not able to delete file from s3');

        return res.status(200).json({
            message: 'File deleted successfully', 
            data: file,
            success: true,
        });
        
    } catch (error) {
        return next(new InternalException(error));
    }
};


export const moveFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fileId = +req.params.fileId;
        const parentFolderId = +req.params.parentFolderId

        const newFile = await readFileByFileId(fileId);
        if(!newFile) throw new Error('Error fetching file');

        const filesWithSameName = await readFileByFileName(newFile.name, parentFolderId);
        if(!filesWithSameName) throw new Error('Error fetching files');

        if(filesWithSameName.length > 0) return next(
            new ConflictException('File with same name exist in Current folder', null)
        );
   
        const file = await updateFilesParentFolder(fileId, parentFolderId);
        if(!file) throw new Error('Error updating file');
    
        return res.status(200).json({
            message: 'File moved successfully', 
            data: file,
            success: true,
        });
        
    } catch (error) {
        return next(new InternalException(error));
    }
};


export const getFilesByFolderId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { parentFolderId } = req.params;
   
        const files = await readFilesByFolderId(+parentFolderId);
        if(!files) throw new Error('Error getting file');

        if(files.length === 0) return next( 
            new NotFoundException('Folder is Empty', null)
        );
        
        return res.status(200).json({
            message: 'Fetched all files successfully', 
            data: files,
            success: true,
        });
        
    } catch (error) {
        return next(new InternalException(error));
    }
};