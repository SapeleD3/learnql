import { hello } from "./resolvers/query/hello";
export const resolvers = {
	Query: {
		hello,
	},
};
