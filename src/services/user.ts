import Prisma, { User } from "./prisma";



export const getUserByEmail = async (email : string): Promise<User | null> => {
    try {
        const user = await Prisma.user.findUnique({
            where: { email },
        });
        return user;

    } catch (error) {
        console.log("Error fiding user by email", error);
        return null;
    }
}

export const getUserById = async (id : number): Promise<User | null> => {
    try {
        const user = await Prisma.user.findUnique({
            where: { id },
        });
        return user;

    } catch (error) {
        console.log("Error fiding user by email", error);
        return null;
    }
}


export interface createUserInput {
    username: string,
    email: string,
    password: string,
}

export const createUser = async (data: createUserInput): Promise<User | null> => {
    try {
        const user = await Prisma.user.create({ data });
        return user;

    } catch (error) {
        console.log("Error creating user", error);
        return null;
    }
}