import {PrismaClient} from '@prisma/client';
import {ApolloError} from 'apollo-server-express';
import {log} from '../../utils';
import {message} from '../../constants';
import {authGaurd} from '../../utils/authGaurd';
// eslint-disable-next-line import/no-cycle
import {context} from '../../Schema';

const prisma = new PrismaClient();

const {somethingwentwrong} = message;

export const me = authGaurd(async (_: any, args: any, ctx: context) => {
	try {
		const {user} = ctx;
		return user;
	} catch (err) {
		log(err);
		return new ApolloError(somethingwentwrong);
	}
});

export const getUserById = async (_: any, args: any) => {
	try {
		const {id} = args;
		const user = await prisma.user.findOne({
			where: {id},
		});
		return user;
	} catch (err) {
		log(err);
		return new ApolloError(somethingwentwrong);
	}
};

export const getAllUsers = async (_: any, __: any) => {
	try {
		const user = await prisma.user.findMany();
		return user;
	} catch (err) {
		log(err);
		return new ApolloError(somethingwentwrong);
	}
};
