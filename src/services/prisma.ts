import { PrismaClient } from '@prisma/client';

const Prisma = new PrismaClient();

export type { User, Folder, File } from '@prisma/client';

export default Prisma;