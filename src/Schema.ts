import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { Request, Response } from "express";
import { ApolloServerExpressConfig } from "apollo-server-express";
import errorHandler from "./middleware/errorHandler";
import { DEV_ENVIRONMENT } from "./constants";
const { NODE_ENV, BRANCH } = process.env;

interface ISettings {
	"request.credentials": "omit" | "include" | "same-origin";
	"schema.polling.enable": boolean;
}
const settings: ISettings = {
	"request.credentials": "include",
	"schema.polling.enable": false,
};

const development: ApolloServerExpressConfig = {
	typeDefs,
	resolvers,
	context: async ({ req, res }: { req: Request; res: Response }) => {
		let userId;
		return {
			userId,
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
	context: async ({ req, res }: { req: Request; res: Response }) => {
		let userId;
		return {
			userId,
		};
	},
	playground: false,
	formatError: (error: any) => {
		return errorHandler(error);
	},
};

export const Schema = () => {
	if (BRANCH === "master") {
		return production;
	}
	return development;
};
