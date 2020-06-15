import { gql } from "apollo-server-express";

export const typeDefs = gql`
	type Tests {
		id: String
		message: String
	}
	type Query {
		hello: String!
		getTests: [Tests]
	}
	type Mutation {
		postTest: Tests
	}
`;
