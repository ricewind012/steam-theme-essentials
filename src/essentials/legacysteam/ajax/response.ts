import type { EResult } from "millennium";

import { Config } from "@/modules/config";

export type AjaxResult_t<T> = { success: EResult } & T;

export const AjaxURLs = {
	PartnerEventsPageable: `${Config.STORE_BASE_URL}events/ajaxgetpartnereventspageable`,
};

export async function GetAjaxResponse<T>(
	strURL: string,
	params: Record<string, unknown>,
): Promise<AjaxResult_t<T>> {
	try {
		return await steamAjaxRequest.get(strURL, { params });
		// biome-ignore lint/suspicious/noExplicitAny: Otherwise "unknown"
	} catch (e: any) {
		// Throw with the error message instead. May return something like
		// {"success":8,"eresult":8,"msg":"stuff"}{"success":1}, so it's not
		// JSON parseable (valve moment)
		throw new Error(e.response.data);
	}
}
