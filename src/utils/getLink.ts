import {PrismaClient} from '@prisma/client';
import {log} from '.';
import {DEV_ENVIRONMENT, LOCAL_URL, PROD_URL} from '../constants';

const {NODE_ENV} = process.env;

const prisma: any = new PrismaClient();
export const getLink = async (username: any) => {
	try {
		const param = `${username.replace(/\s/g, '-')}`;
		const getCode = () => {
			let text = '';
			const possible = '0123456789';
			// eslint-disable-next-line no-plusplus
			for (let i = 0; i < 3; i++)
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			return text;
		};

		let link =
			NODE_ENV === DEV_ENVIRONMENT
				? `${LOCAL_URL}/${param}`
				: `${PROD_URL}/${param}`;

		const validLink = await prisma.user.findOne({
			where: {user_link: link},
		});
		console.log('check', validLink);
		if (validLink) {
			link =
				NODE_ENV === DEV_ENVIRONMENT
					? `${LOCAL_URL}/${param}${getCode()}`
					: `${PROD_URL}/${param}${getCode()}`;
		}
		return link;
	} catch (err) {
		log(err);
		return null;
	}
};
