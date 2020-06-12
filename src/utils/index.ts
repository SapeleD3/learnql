import debug from "debug";

import { NAMESPACE } from "../constants";

/**
 * Logs message to the console in dev mode
 * @param data the data to be logged
 * @returns void
 */
export function log(data: any): void {
	const logger = debug(NAMESPACE);
	logger(data);
}
