import {hello} from './resolvers/query/hello';
import {
	register,
	deleteUser,
	login,
	updateUserDetails,
} from './resolvers/mutation/user';
import {getAllUsers, getUserById, me} from './resolvers/query/user';

const resolvers = {
	Query: {
		me,
		getAllUsers,
		getUserById,
		hello,
	},
	Mutation: {
		register,
		deleteUser,
		login,
		updateUserDetails,
	},
};

export default resolvers;
