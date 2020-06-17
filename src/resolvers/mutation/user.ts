import {PrismaClient} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {v5 as uuidv5} from 'uuid';
import {ApolloError} from 'apollo-server-express';
import {MY_NAMESPACE, message} from '../../constants';
import {validateSignUpData, validateLoginData} from '../../utils/validators';
import {getLink} from '../../utils/getLink';
import {log} from '../../utils';
import {authGaurd} from '../../utils/authGaurd';
import {context} from '../../Schema';

const prisma = new PrismaClient();

const {JWT_KEY} = process.env;
const {somethingwentwrong, invalidCred} = message;
export const register = async (_: any, args: any) => {
	const {email, password, username, image, confirmPassword} = args.input;
	const data: any = {email, password, username, confirmPassword};
	const {valid, errors} = validateSignUpData(data);
	const userLink = await getLink(username);
	if (!valid) {
		if (errors.email) throw new ApolloError(errors.email);
		if (errors.confirmPassword) throw new ApolloError(errors.confirmPassword);
		if (errors.password) throw new ApolloError(errors.password);
		if (errors.username) throw new ApolloError(errors.username);
		return new ApolloError(somethingwentwrong);
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await prisma.user.create({
		data: {
			id: uuidv5(email, MY_NAMESPACE),
			email,
			image,
			user_link: userLink,
			username,
			create_on: new Date(),
			password: hashedPassword,
		},
	});
	const token = await jwt.sign(
		{
			id: user.id,
			email,
		},
		JWT_KEY,
		{expiresIn: '2h'},
	);
	return token;
};

export const deleteUser = async (_: any, args: any) => {
	try {
		const {id} = args;
		await prisma.user.delete({
			where: {id},
		});
		return true;
	} catch (err) {
		log(err);
		return false;
	}
};

export const login = async (_: any, args: any) => {
	const {email, password} = args.input;
	const data: any = {email, password};
	const {valid, errors} = validateLoginData(data);
	if (!valid) {
		if (errors.email) throw new ApolloError(errors.email);
		if (errors.password) throw new ApolloError(errors.password);
		return new ApolloError(somethingwentwrong);
	}
	const user = await prisma.user.findOne({
		where: {email},
	});
	if (!user) {
		return new ApolloError(invalidCred);
	}
	const response = await bcrypt.compare(password, user.password);
	if (!response) {
		return new ApolloError(invalidCred);
	}
	const token = await jwt.sign(
		{
			id: user.id,
			email: user.email,
		},
		JWT_KEY,
		{expiresIn: '2h'},
	);
	return token;
};

export const updateUserDetails = authGaurd(
	async (_: any, args: any, ctx: context) => {
		try {
			let {social} = args.input;
			social = JSON.stringify(social);
			const {
				user: {id},
			} = ctx;
			await prisma.user.updateMany({
				where: {id},
				data: {...args.input, social},
			});
			return true;
		} catch (err) {
			log(err);
			return false;
		}
	},
);
