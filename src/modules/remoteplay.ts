import { findModuleExport, type SteamAppOverview } from "millennium";

export const GetAppMobileCategories: (
	overview: SteamAppOverview,
) => Array<"phone" | "tablet"> = findModuleExport((e) =>
	e.toString().match(/of [\w$]+\.store_category/),
);
