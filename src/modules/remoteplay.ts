import { findModuleExport } from "@steambrew/client";

export const GetAppMobileCategories: (
	overview: any,
) => Array<"phone" | "tablet"> = findModuleExport((e) =>
	e.toString().match(/of [\w$]+\.store_category/),
);
