import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTests = async () => {
	try {
		const test = await prisma.test.findMany();
		return test;
	} catch (err) {
		return null;
	}
};
