import Prisma, { File } from "./prisma";


export interface createFileInput {
    name: string,
    userId: number,
    folderId: number,
    size: number,
    url: string,
    key: string,
}


export const createFile = async (data: createFileInput): Promise<File | null> => {
    try {
        const file = await Prisma.file.create({ data });
        return file;

    } catch (error) {
        console.log("Error creating file", error);
        return null;
    }
}


export const readFileByFileName = async (name : string, folderId: number): Promise<Array<File> | null> => {
    try {
        const files = await Prisma.file.findMany({
            where: {
                name,
                folderId,
            }
        });

        return files;

    } catch (error) {
        console.log("Error reading files", error);
        return null;
    }
}


export const readFileByFileId = async (id: number): Promise<File | null> => {
    try {
        const file = await Prisma.file.findUnique({
            where: { id }
        });

        return file;

    } catch (error) {
        console.log("Error reading files", error);
        return null;
    }
}


export const updateFileName = async (id: number, name: string): Promise<File | null> => {
    try {
        const file = await Prisma.file.update({
            where: { id },
            data: { name },
        });
        return file;

    } catch (error) {
        console.log("Error creating file", error);
        return null;
    }
}


export const deleteFile = async (id: number): Promise<File | null> => {
    try {
        const file = await Prisma.file.delete({
            where: { id },
        });
        return file;

    } catch (error) {
        console.log("Error deleting file", error);
        return null;
    }
}


export const updateFilesParentFolder = async (id: number, folderId: number): Promise<File | null> => {
    try {
        const file = await Prisma.file.update({
            where: { id },
            data: { folderId },
        });
        return file;

    } catch (error) {
        console.log("Error creating file", error);
        return null;
    }
}


export const readFilesByFolderId = async (folderId: number): Promise<Array<File> | null> => {
    try {
        const files = await Prisma.file.findMany({
            where: { folderId }
        });

        return files;

    } catch (error) {
        console.log("Error reading files", error);
        return null;
    }
}