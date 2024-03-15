import { PrismaClient } from '@prisma/client';

// Define a type for the extended global object to include the Prisma client
type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClient;
};

// Ensure the global object is correctly typed
const globalForPrisma = globalThis as GlobalWithPrisma;

// Singleton pattern for Prisma client
const prismaClientSingleton = (): PrismaClient => {
  // Check if we're not in production and the global object already has a Prisma client
  if (process.env.NODE_ENV !== 'production') {
    // If the global object doesn't have a Prisma client, create a new instance
    globalForPrisma.prisma = globalForPrisma.prisma || new PrismaClient();
  } else if (!globalForPrisma.prisma) {
    // For production, always create a new instance if not already created
    globalForPrisma.prisma = new PrismaClient();
  }

  return globalForPrisma.prisma;
};

// Initialize the Prisma client using the singleton pattern
const prisma = prismaClientSingleton();

export default prisma;