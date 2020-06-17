import {gql} from 'apollo-server-express';

export const typeDefs = gql`
	type User {
		bio: String
		create_on: String
		email: String!
		id: String!
		image: String
		password: String
		user_link: String
		social: [Social]
		username: String
		website: String
	}

	input Update {
		bio: String
		email: String
		image: String
		password: String
		social: [SocialInput]
		username: String
		website: String
	}

	input SocialInput {
		name: String
		icon: String
		url: String
	}

	type Social {
		name: String
		icon: String
		url: String
	}

	input Reginput {
		email: String!
		password: String!
		username: String!
		image: String!
		confirmPassword: String!
	}

	input LoginInput {
		email: String!
		password: String!
	}

	type Query {
		hello: String!
		me: User
		getAllUsers: [User]
		getUserById(id: ID!): User
	}
	type Mutation {
		register(input: Reginput): String!
		deleteUser(id: ID!): Boolean
		login(input: LoginInput): String!
		updateUserDetails(input: Update): Boolean
	}
`;
