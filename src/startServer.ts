import "reflect-metadata";
import "dotenv/config";
import "colors";

import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as helmet from "helmet";
import * as RateLimit from "express-rate-limit";
import * as RateLimitRedisStore from "rate-limit-redis";
import { ApolloServer } from "apollo-server-express";
import { Schema } from "./Schema";
import { log } from "./utils";
import { redis } from "./redis";
import { NOT_FOUND } from "http-status-codes";

const { NODE_ENV, PORT } = process.env;
const app = express();
// bodyParser is needed just for POST.
app.use(bodyParser.json());
app.use(helmet());
app.use(
	// cors({
	// 	credentials: true,
	// 	origin: !!BRANCH
	// 		? MAIN_PROD_URL
	// 		: NODE_ENV === DEV_ENVIRONMENT
	// 		? LOCAL_URL
	// 		: PROD_URL,
	// })
	cors()
);
app.use(
	RateLimit({
		store: new RateLimitRedisStore({
			client: redis,
		}),
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
	})
);

const startServer = async () => {
	const server = new ApolloServer(Schema());
	server.applyMiddleware({
		app,
		path: "/graphql",
		cors: false,
	});
	// handle all non graphql requests
	app.all("/*", (_, res) => {
		return res.status(NOT_FOUND).send("Invalid route");
	});
	app.listen(PORT, () =>
		log(
			`Server running on http://localhost:${PORT}${server.graphqlPath} in ${NODE_ENV} mode`
				.yellow.bold
		)
	);
};

export { startServer };
