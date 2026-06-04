import { FindModuleExportByString } from "../utils/shared";

/**
 * Replaces `%1$s`, `%2$s`, etc. in a localization string with provided arguments.
 */
export const Localize: (
	strToken: string,
	...args: (string | number)[]
) => string = FindModuleExportByString("LocalizeString(e);return");
