import {Request} from 'express';
import {ApolloServerExpressConfig, ApolloError} from 'apollo-server-express';
import {typeDefs} from './typeDefs';
import resolvers from './resolvers';
import errorHandler from './middleware/errorHandler';
import {DEV_ENVIRONMENT, message} from './constants';
import {tradeTokenForUser} from './utils/auth-helper';
import {IUser} from './types/Schema';

const {NODE_ENV} = process.env;
const {unauthorized} = message;

interface ISettings {
	'request.credentials': 'omit' | 'include' | 'same-origin';
	'schema.polling.enable': boolean;
}
const settings: ISettings = {
	'request.credentials': 'include',
	'schema.polling.enable': false,
};

export interface context {
	req: Request;
	user: IUser;
}

const development: ApolloServerExpressConfig = {
	typeDefs,
	resolvers,
	context: async ({req}: {req: Request}) => {
		const {
			headers: {authorization},
		} = req;
		let token;
		if (authorization && authorization.startsWith('Bearer ')) {
			token = authorization.split('Bearer ')[1];
		} else {
			token = '';
		}
		let user;
		if (token) {
			user = await tradeTokenForUser(token, req);
		} else {
			user = {};
		}
		return {
			req,
			user,
		};
	},
	playground: {
		settings,
	},
	introspection: NODE_ENV === DEV_ENVIRONMENT ? undefined : true,
	formatError: (error: any) => {
		return errorHandler(error);
	},
};

const production: ApolloServerExpressConfig = {
	typeDefs,
	resolvers,
	context: async ({req}: {req: Request}) => {
		const {
			headers: {authorization},
		} = req;
		let token;
		if (authorization && authorization.startsWith('Bearer ')) {
			token = authorization.split('Bearer ')[1];
		} else {
			return new ApolloError(unauthorized);
		}
		const user = await tradeTokenForUser(token, req);
		return {
			req,
			user,
		};
	},
	playground: false,
	formatError: (error: any) => {
		return errorHandler(error);
	},
};

export const Schema = () => {
	if (NODE_ENV !== 'development') {
		return production;
	}
	return development;
};
