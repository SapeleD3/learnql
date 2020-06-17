import {ApolloError} from 'apollo-server-express';

import {message} from '../constants';

const {unauthorized} = message;

export const authGaurd = (next: any) => (
	root: any,
	args: any,
	ctx: any,
	info: any,
) => {
	const {req}: any = ctx;
	if (!req.user) {
		return new ApolloError(unauthorized);
	}
	return next(root, args, ctx, info);
};
