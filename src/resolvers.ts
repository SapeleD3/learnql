import { hello } from "./resolvers/query/hello";
import { getTests } from "./resolvers/query/tests";
import { postTest } from "./resolvers/mutation/tests";

const resolvers = {
	Query: {
		hello,
		getTests,
	},
	Mutation: {
		postTest,
	},
};

export default resolvers;
