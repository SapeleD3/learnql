import * as Redis from "ioredis";

let redis: any;
const { REDIS_URL } = process.env;

if (REDIS_URL) {
	redis = new Redis(REDIS_URL);
} else {
	redis = new Redis();
}

export { redis };
