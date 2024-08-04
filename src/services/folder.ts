import Prisma, { Folder } from "./prisma";
import { deleteFromS3 } from "./awsS3";


export interface createFolderInput {
    name: string,
    userId: number,
    parentFolderId: number | null,
}


export const createFolder = async (data: createFolderInput): Promise<Folder | null> => {
    try {
        const folder = await Prisma.folder.create({ data });
        return folder;

    } catch (error) {
        console.log("Error creating folder", error);
        return null;
    }
}


export const readFolderByFolderId = async (folderId : number): Promise<Folder | null> => {
    try {
        const folder = await Prisma.folder.findUnique({
            where: {
                id: folderId,
            }
        });

        return folder;

    } catch (error) {
        console.log("Error reading folder", error);
        return null;
    }
}


export const readFolderByFolderName = async (name : string, parentFolderId: number | null): Promise<Array<Folder> | null> => {
    try {
        const folders = await Prisma.folder.findMany({
            where: {
                name: name,
                parentFolderId,
            }
        });

        return folders;

    } catch (error) {
        console.log("Error reading folders", error);
        return null;
    }
}


export const readAllSubFolderByParentFolderId = async (folderId : number): Promise<Array<Folder> | null> => {
    try {
        const folders = await Prisma.folder.findMany({
            where: {
                parentFolderId: folderId,
            }
        });

        return folders;

    } catch (error) {
        console.log("Error reading all sub folders", error);
        return null;
    }
}


export const readRootFolderByUserId = async (userId : number): Promise<Array<Folder> | null> => {
    try {
        const folders = await Prisma.folder.findMany({
            where: {
                parentFolderId: null,
                userId,
            }
        });

        return folders;

    } catch (error) {
        console.log("Error reading all sub folders", error);
        return null;
    }
}


export const updateFolderName = async (id: number, name: string): Promise<Folder | null> => {
    try {
        const folder = await Prisma.folder.update({
            where: { id },
            data: { name },
        });
        return folder;

    } catch (error) {
        console.log("Error creating folder", error);
        return null;
    }
}

export const deleteFolder = async (id: number): Promise<Folder | null> => {
    try {
        const folder = await Prisma.$transaction(async prisma => {

            const folder = await prisma.folder.delete({
                where: { id },
            });

            // All Subfolder get deleted automatically because of "on delete cascade" property applied on schema.
            // All files in thoes folder and subfolder have null value in their folderId because of "on delete null" property applied on schema.
            // following code for deleting thoes files from DB and s3.

            const files = await prisma.file.findMany({
                where: { folderId: null}
            });

            const fileIds = files.map(f => f.id);
            const s3Keys = files.map(f => f.key);

            await prisma.file.deleteMany({
              where: { id: { in: fileIds } },
            });

            await Promise.all(s3Keys.map(key => deleteFromS3(key)));

            return folder;
        })

        return folder;

    } catch (error) {
        console.log("Error deleting folder", error);
        return null;
    }
}