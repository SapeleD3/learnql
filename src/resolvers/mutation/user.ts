import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { v5 as uuidv5 } from "uuid";
import { IUser } from "../../types/Schema";
import { MY_NAMESPACE } from "../../constants";

const prisma = new PrismaClient();

const { secret } = process.env;

export const register = async (_: any, args: IUser) => {
	const { email, password, username, image } = args;
	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = {
		id: uuidv5(email, MY_NAMESPACE),
		email,
		image,
		username,
		create_on: new Date(),
		password: hashedPassword,
	};
	const user = await prisma.user.create({ data: newUser });
	const token = await jwt.sign(
		{
			id: user.id,
			email,
		},
		secret,
		{ expiresIn: "2h" }
	);
	return token;
};
