import * as jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';
import {log} from '.';

const prisma = new PrismaClient();
const {JWT_KEY} = process.env;

export const tradeTokenForUser = async (token, req) => {
	try {
		const decodedToken: any = await jwt.verify(token, JWT_KEY);
		const {id, email} = decodedToken;
		req.user = decodedToken;
		const user = await prisma.user.findOne({
			where: {
				id: decodedToken.id,
			},
		});
		req.user.id = id;
		req.user.email = email;
		return user;
	} catch (err) {
		log(err);
		return null;
	}
};
